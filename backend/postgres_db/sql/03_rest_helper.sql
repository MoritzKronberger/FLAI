/*************************************************************************************
 * functions for REST functionality
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP FUNCTION IF EXISTS rest_helper       CASCADE;
DROP FUNCTION IF EXISTS json_keys_to_text CASCADE;
DROP FUNCTION IF EXISTS arr_to_text       CASCADE;

/* Rest helper */
-- REST helper that provides GET, PUT, PATCH and DELETE functionality independently from table an data types
-- inspired by https://stackoverflow.com/questions/17905501/postgresql-insert-data-into-table-from-json/17908760#17908760
CREATE OR REPLACE FUNCTION rest_helper(_table             TEXT,                   -- table to perform REST action on and infer data types from 
                                       _data              JSONB,                  -- data that should be inserted or updated
                                       _method            TEXT,                   -- GET, PUT, PATCH or DELETE (case insensitive)
                                       _ids               JSONB   DEFAULT NULL,   -- key value pairs of attributes identifying the row(s) to perform REST actions on
                                       _select_cols       TEXT[]  DEFAULT NULL,   -- names of columns to return on GET or PATCH
                                       _postgres_status   TEXT    DEFAULT '02000',
                                       _http_status       INTEGER DEFAULT 200,
                                       _http_error_status INTEGER DEFAULT 400)
    RETURNS TABLE (result JSONB)
LANGUAGE plpgsql
AS
$$
    DECLARE
        _data_values_   TEXT;
        _pk_values_     TEXT;
        _select_values_ TEXT;
        _query_         TEXT   DEFAULT NULL;
        _ids_           RECORD DEFAULT NULL;
        _ids_json_      JSONB  DEFAULT NULL;
        _rows_          JSONB  DEFAULT NULL;

        _constraint_    TEXT   DEFAULT _table || ' exists';
        _pgstate_       TEXT;
        _cname_         TEXT;
        _message_       TEXT;
    BEGIN
        -- collect the names of the columns into which should be inserted (provided by the json keys) into _data_values_
        _data_values_ := json_keys_to_text(_data);
        -- collect the column names making up the tables pk or unique identifier(provided by the json keys) into _pk_values_
        _pk_values_ := json_keys_to_text(_ids);
        -- collect the names of the columns that should be selected and returned (provided by the array) into _select_values_  
        _select_values_ := arr_to_text(_select_cols);

        IF LOWER(_method) = 'get'
        THEN        
            -- build a simple SELECT ... FROM ... WHERE ... query
            -- SELECT the columns specified in _select_cols and return rows matching the identifiers in _ids
            -- aggregate all result rows in one array and convert it to jsonb
            _query_ := 'SELECT TO_JSONB(ARRAY_AGG(sub)) AS "rows"' ||
                      ' FROM ('
                            ' SELECT ' || _select_values_ ||
                            ' FROM ' || QUOTE_IDENT(_table) ||
                            CASE WHEN _ids IS NOT NULL
                            THEN
                            ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                             ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1))) sub'
                            ELSE
                            ') sub'
                            END;
        ELSIF LOWER(_method) = 'post'
        THEN        
            -- build an INSERT query inserting only the elements of _data into _table
            -- data types are inferred and cast from _table using JSONB_POPULATE_RECORD
            _query_ := 'INSERT INTO ' || QUOTE_IDENT(_table) || ' (' || _data_values_ || ') ' ||
                       'SELECT ' || _data_values_ ||  
                      ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1) ';
        ElSIF LOWER(_method) = 'patch'
        THEN
            -- build an UPDATE query updating only the elements of _data on _table
            -- data types are inferred and cast from _table using JSONB_POPULATE_RECORD
            _query_ := 'UPDATE ' || QUOTE_IDENT(_table) || 
                      ' SET ' || '(' || _data_values_ || ') = (SELECT ' || _data_values_ || 
                                                             ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1))'
                      ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                       ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))';
        ElSIF LOWER(_method) = 'delete'
        THEN
            -- build a DELETE query deleting the row(s) corresponding to the identifiers in _ids from _table
            -- data types are inferred and cast from _table using JSONB_POPULATE_RECORD
            _query_ := 'DELETE'
                      ' FROM ' || QUOTE_IDENT(_table) ||
                      ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                       ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))';
        ELSE
            -- if _method matches no known method return fitting constraint
            -- don't build query if method is unknown
            _constraint_ := _method || ' exists';
        END IF;

        -- execute query if one was built
        IF _query_ IS NOT NULL
        THEN
            -- return results into different variables, depending on REST-method
            IF LOWER(_method) = 'get'
            THEN
                EXECUTE _query_ INTO _rows_ USING _ids;
            ELSE
                -- execute query using id(s) or other unique value(s)
                -- if no id was provided try using the id attribute (helpful on INSERT)
                EXECUTE _query_ || 'RETURNING ' || COALESCE(_pk_values_, _select_values_, 'id') INTO _ids_ USING _data, _ids;
                -- convert returned id(s) to json and set to null if all values are null
                _ids_json_ := NULLIF(JSONB_STRIP_NULLS(TO_JSONB(_ids_)), '{}');
            END IF;
        END IF;

        IF _ids_ IS NOT NULL OR _rows_ IS NOT NULL
        THEN 
            -- return query results if they exists
            RETURN QUERY
            SELECT json_status(_http_status, _ids_json_, _rows_);
        ELSE 
            -- else return 404 constraint
            RETURN QUERY
            SELECT json_status(404, 
                               _ids_json_, 
                               _rows_,
                               _postgres_status, 
                               _constraint_, 
                               _message_);
        END IF;

        -- in case of any other uncaught exception: return it with error code
        -- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
        EXCEPTION WHEN OTHERS THEN 
            GET STACKED DIAGNOSTICS
                _pgstate_ = RETURNED_SQLSTATE,
                _cname_   = CONSTRAINT_NAME,
                _message_ = MESSAGE_TEXT;
            RETURN QUERY
            SELECT json_status(_http_error_status, 
                               _ids_json_, 
                               _rows_,
                               _pgstate_, 
                               CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END, 
                               _message_);

    END
$$
;

/* JSON keys to text */
CREATE OR REPLACE FUNCTION json_keys_to_text(_data JSONB)
    RETURNS TEXT
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    -- collect all keys in the json and concatenate them to a comma separated string with correct quoting
    SELECT STRING_AGG(QUOTE_IDENT(KEY), ',')
    FROM JSONB_OBJECT_KEYS(_data) AS X (KEY);
$$
;

/* Array to text */
CREATE OR REPLACE FUNCTION arr_to_text(_data TEXT[])
    RETURNS TEXT
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    -- concatenate all array elements to a comma separated string with correct quoting
    SELECT STRING_AGG(QUOTE_IDENT(val), ',')
    FROM UNNEST(_data::TEXT[]) AS val;
$$
;

COMMIT;

/****************************************************************************************
 * Test queries for functions
 * Depending on the state of the database not all queries will work with the given values
 ****************************************************************************************/

-- test POST, PATCH, DELETE for tables with single-id-pk
/*
SELECT * FROM "user";

SELECT *
FROM rest_helper
     ('user', 
      '{"email": "new_user@email.com",
        "username": "new_user",
        "password": "supersecret",
        "right_handed": "false"
       }',
       'POST'
     );

SELECT * FROM "user";


SELECT * FROM "user";

SELECT * FROM rest_helper
         ('user',
          '{"username": "new_user"}',
          'PATCH',
          '{"id": "<user-id>"}');

SELECT * FROM "user";


SELECT * FROM "user";

SELECT * FROM rest_helper
         ('user',
           NULL,
          'DELETE',
          '{"id": "<user-id>"}');

SELECT * FROM "user";
*/

-- test POST, PATCH, DELETE for tables with combined pk
/*
SELECT * FROM "sign"
WHERE "name"='y';
SELECT * FROM "exercise";
SELECT * FROM "user";

SELECT * FROM "learns_sign";

SELECT *
FROM rest_helper
     ('learns_sign', 
      '{"user_id": "<user-id>",
        "sign_id": "<sign-id>",
        "exercise_id": "<exercise-id>"
       }',
      'POST',
       NULL,
      '{user_id, sign_id, exercise_id}'
     );

SELECT * FROM "learns_sign";


SELECT * FROM "learns_sign";

SELECT *
FROM rest_helper
     ('learns_sign', 
      '{"progress": "90"}',
      'PATCH',
      '{"user_id": "<user-id>",
        "sign_id": "<sign-id>",
        "exercise_id": "<exercise-id>"
       }'
     );

SELECT * FROM "learns_sign";


SELECT * FROM "includes_sign";

SELECT *
FROM rest_helper
     ('includes_sign', 
      NULL,
      'DELETE',
      '{"task_id": "<task-id>",
        "sign_id": "<sign-id>"
       }'
     );

SELECT * FROM "includes_sign";
*/

-- test GET requests for one or multiple returned rows
/*
SELECT * FROM "sign";

SELECT * FROM rest_helper
              ('sign', 
               NULL, 
               'GET', 
               '{"id": "<id>"}', 
               '{name}'
              );


SELECT * FROM "sign_recording";

SELECT * FROM rest_helper
              ('sign_recording', 
               NULL, 
               'GET', 
               '{"sign_id": "<sign-id>"}', 
               '{path, mimetype_id}'
              );
*/

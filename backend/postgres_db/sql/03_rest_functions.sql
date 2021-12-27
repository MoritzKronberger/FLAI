/*************************************************************************************
 * functions for REST functionality
 * json_status and error_handler from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS json_status       CASCADE;
DROP FUNCTION IF EXISTS pg_axios          CASCADE;
DROP FUNCTION IF EXISTS json_keys_to_text CASCADE;

/* REST functions */

/* REST helper to end all REST helpers */
/* insprired by https://stackoverflow.com/questions/17905501/postgresql-insert-data-into-table-from-json/17908760#17908760*/
CREATE OR REPLACE FUNCTION pg_axios(_table             TEXT, 
                                    _data              JSONB,
                                    _method            TEXT,
                                    _ids               JSONB   DEFAULT NULL,
                                    _select_cols       TEXT[]  DEFAULT NULL,
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

        _constraint_  TEXT DEFAULT  _table || ' exists';
        _pgstate_     TEXT;
        _cname_       TEXT;
        _message_     TEXT;
    BEGIN
        -- collect the values that shoud be posted (provided by the json keys) into _data_values_
        _data_values_ := json_keys_to_text(_data);
        -- collect the columns making up the tables pk or unique identifier(provided by the json keys) into _pk_values_
        _pk_values_ := json_keys_to_text(_ids);
        -- collect the values that shoud be selected (provided by the array) into _select_values_  
        SELECT STRING_AGG(QUOTE_IDENT(val), ',') STRICT INTO _select_values_
        FROM UNNEST(_select_cols::TEXT[]) AS val;

        IF LOWER(_method) = 'get'
        THEN        
            -- build a simple SELECT ... FROM ... WHERE query
            -- aggregate all results in one array row and convert to jsonb
            _query_ := 'SELECT TO_JSONB(ARRAY_AGG(sub)) AS "rows"' ||
                      ' FROM ('
                            ' SELECT ' || _select_values_ ||
                            ' FROM ' || QUOTE_IDENT(_table) ||
                            ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                             ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1))'
                        ') sub';
        ELSIF LOWER(_method) = 'post'
        THEN        
            -- build an INSERT query inserting only the elements of _data into _table
            -- datatypes are infered and cast from _table
            _query_ := 'INSERT INTO ' || QUOTE_IDENT(_table) || ' (' || _data_values_ || ') ' ||
                       'SELECT ' || _data_values_ ||  
                      ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1) ';
        ElSIF LOWER(_method) = 'patch'
        THEN
            -- build an UPADTE query updating only the elements of _data on _table
            -- datatypes are infered and cast from _table
            _query_ := 'UPDATE ' || QUOTE_IDENT(_table) || 
                      ' SET ' || '(' || _data_values_ || ') = (SELECT ' || _data_values_ || 
                                                             ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1))'
                      ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                       ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))';
        ElSIF LOWER(_method) = 'delete'
        THEN
            -- build a DELETE query deleting the row corresponding to _id from _table
            -- datatypes are infered and cast from _table
            _query_ := 'DELETE'
                      ' FROM ' || QUOTE_IDENT(_table) ||
                      ' WHERE (' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                       ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))';
        ELSE
            _constraint_ := _method || ' exists';
        END IF;

        -- execute query if one was built
        IF _query_ IS NOT NULL
        THEN
            IF LOWER(_method) = 'get'
            THEN
                EXECUTE _query_ INTO _rows_ USING _ids;
            ELSE
                -- execute query using id(s) or other unique value(s)
                -- if no id was provided try using the id attribute (helpful on INSERT)
                EXECUTE _query_ || 'RETURNING ' || COALESCE(_pk_values_, 'id') INTO _ids_ USING _data, _ids;
                -- convert returned id(s) to json and set to null if all values are null
                _ids_json_ := NULLIF(JSONB_STRIP_NULLS(TO_JSONB(_ids_)), '{}');
            END IF;
        END IF;

        IF _ids_ IS NOT NULL OR _rows_ IS NOT NULL
        THEN 
            RETURN QUERY
            SELECT json_status(_http_status, _ids_json_, _rows_);
        ELSE 
            RETURN QUERY
            SELECT json_status(_http_error_status, 
                               _ids_json_, 
                               _rows_,
                               _postgres_status, 
                               _constraint_, 
                               _message_);
        END IF;

        EXCEPTION WHEN OTHERS THEN 
            GET STACKED DIAGNOSTICS
                _pgstate_ = RETURNED_SQLSTATE,
                _cname_   = CONSTRAINT_NAME,
                _message_ = MESSAGE_TEXT;
            RETURN QUERY
            SELECT json_status(400, 
                               _ids_json_, 
                               _rows_,
                               _pgstate_, 
                               CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END, 
                               _message_);

    END
$$
;

/* JSON STATUS */
CREATE OR REPLACE FUNCTION json_status(_status     INTEGER,
                                       _ids        JSONB,
                                       _rows       JSONB   DEFAULT NULL,
                                       _pgstate    TEXT    DEFAULT '00000',
                                       _constraint TEXT    DEFAULT NULL,
                                       _message    TEXT    DEFAULT NULL)
    RETURNS JSONB
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    SELECT JSONB_BUILD_OBJECT
           ('status', _status,
            'ids', _ids,
            'rows', _rows,
            'pgstate', _pgstate,
            'constraint', _constraint,
            'message', _message);
$$
;

/* JSON KEYS TO TEXT */
CREATE OR REPLACE FUNCTION json_keys_to_text(_data JSONB)
    RETURNS TEXT
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    -- collect all keys in the json and concatenate them to a comma seperated string
    SELECT STRING_AGG(QUOTE_IDENT(KEY), ',')
    FROM JSONB_OBJECT_KEYS(_data) AS X (KEY);
$$
;

COMMIT;

/*
SELECT * FROM "user";

SELECT *
FROM pg_axios
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

SELECT * FROM pg_axios
         ('user',
          '{"username": "new_user"}',
          'PATCH',
          '{"id": "<user-id>"}');

SELECT * FROM "user";


SELECT * FROM "user";

SELECT * FROM pg_axios
         ('user',
           NULL,
          'DELETE',
          '{"id": "<user-id>"}');

SELECT * FROM "user";
*/

/*
SELECT * FROM "sign"
WHERE "name"='y';
SELECT * FROM "exercise";
SELECT * FROM "user";

SELECT * FROM "learns_sign";

SELECT *
FROM pg_axios
     ('learns_sign', 
      '{"user_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
        "sign_id": "e86250ca-523d-414b-b2c1-57732d2f1b9c",
        "exercise_id": "f2c8731c-139e-4522-9609-94171af82c3a"
       }',
       'POST',
      '{"user_id": "",
        "sign_id": "",
        "exercise_id": ""
       }'
     );

SELECT * FROM "learns_sign";


SELECT * FROM "learns_sign";

SELECT *
FROM pg_axios
     ('learns_sign', 
      '{"progress": "90"}',
      'PATCH',
      '{"user_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
        "sign_id": "e86250ca-523d-414b-b2c1-57732d2f1b9c",
        "exercise_id": "f2c8731c-139e-4522-9609-94171af82c3a"
       }'
     );

SELECT * FROM "learns_sign";


SELECT * FROM "includes_sign";

SELECT *
FROM pg_axios
     ('includes_sign', 
      NULL,
      'DELETE',
      '{"task_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
        "sign_id": "e86250ca-523d-414b-b2c1-57732d2f1b9c"
       }'
     );

SELECT * FROM "includes_sign";
*/

/*
SELECT * FROM "sign";

SELECT * FROM pg_axios('sign', 
                       NULL, 
                       'GET', 
                       '{"id": "2a6525f9-5d6b-4313-87d0-c94ca1eda9e0"}', 
                       '{name}');


SELECT * FROM "sign_recording";

SELECT * FROM pg_axios('sign_recording', 
                       NULL, 
                       'GET', 
                       '{"sign_id": "4277a0e5-2125-4b10-8c02-7dfdc0e101f5"}', 
                       '{path, mimetype_id}');
*/

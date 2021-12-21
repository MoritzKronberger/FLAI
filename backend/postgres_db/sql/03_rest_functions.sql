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
                                    _id                UUID    DEFAULT NULL,
                                    _ids               JSONB   DEFAULT NULL,
                                    _postgres_status   TEXT    DEFAULT '02000',
                                    _http_status       INTEGER DEFAULT 200,
                                    _http_error_status INTEGER DEFAULT 400)
    RETURNS TABLE (result JSONB)
LANGUAGE plpgsql
AS
$$
    DECLARE
        _data_values_ TEXT;
        _query_       TEXT   DEFAULT NULL;
        _id_          UUID   DEFAULT NULL;
        _pk_values_   TEXT;
        _ids_         RECORD DEFAULT NULL;
        _ids_json_    JSONB  DEFAULT NULL;

        _constraint_  TEXT DEFAULT  _table || ' exists';
        _pgstate_     TEXT;
        _cname_       TEXT;
        _message_     TEXT;
    BEGIN
        -- collect the values that shoud be posted (provided by the json keys) in _data_values_
        _data_values_ := json_keys_to_text(_data);

        IF _ids IS NOT NULL
        THEN 
            -- collect the columns making up the tables primary key (provided by the json keys) into _pk_values_
            _pk_values_ := json_keys_to_text(_ids);
        END IF;

        IF LOWER(_method) = 'post'
        THEN        
            -- build an INSERT query inserting only the elements of _data into _table
            -- datatypes are infered and cast from _table
            _query_ := 'INSERT INTO ' || QUOTE_IDENT(_table) || ' (' || _data_values_ || ') ' ||
                       'SELECT ' || _data_values_ ||  
                      ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1) ';
        ElSIF LOWER(_method) = 'patch'
        THEN
            -- build an UPADTE query updating only the elements of _data on _table
            -- use multiple ids or other unique values if no single id was provided
            -- datatypes are infered and cast from _table
            _query_ := 'UPDATE ' || QUOTE_IDENT(_table) || 
                      ' SET ' || '(' || _data_values_ || ') = (SELECT ' || _data_values_ || 
                                                             ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1))'
                      ' WHERE ' || CASE WHEN _id IS NOT NULL
                                   THEN 'id = $2'
                                   ELSE '(' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                                  ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))' 
                                   END;
        ElSIF LOWER(_method) = 'delete'
        THEN
            -- build a DELETE query deleting the row corresponding to _id from _table
            -- use multiple ids or other unique values if no single id was provided
            -- datatypes are infered and cast from _table
            _query_ := 'DELETE'
                      ' FROM ' || QUOTE_IDENT(_table) ||
                      ' WHERE ' || CASE WHEN _id IS NOT NULL
                                   THEN 'id = $2'
                                   ELSE '(' || _pk_values_ || ') = (SELECT ' || _pk_values_ || 
                                                                  ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $2))' 
                                   END;
        ELSE
            _constraint_ := _method || ' exists';
        END IF;

        -- execute query if one was built
        IF _ids IS NULL AND _query_ IS NOT NULL
        THEN
            -- execute query using single id if it was provided
            EXECUTE _query_ || ' RETURNING id' INTO _id_ USING _data, _id;
        ELSIF _query_ IS NOT NULL
        THEN
            -- execute query using multiple ids or other unique values
            EXECUTE _query_ || 'RETURNING ' || _pk_values_ INTO _ids_ USING _data, _ids;
            -- convert returned ids to json and set to null if all values are null
            _ids_json_ := NULLIF(JSONB_STRIP_NULLS(TO_JSONB(_ids_)), '{}');
        END IF;

        IF _id_ IS NOT NULL OR _ids_ IS NOT NULL
        THEN 
            RETURN QUERY
            SELECT json_status(_http_status, _id_, _ids => _ids_json_);
        ELSE 
            RETURN QUERY
            SELECT json_status(_http_error_status, 
                               _id_, 
                               _postgres_status, 
                               _constraint_, 
                               _message_,
                               _ids_json_);
        END IF;

        EXCEPTION WHEN OTHERS THEN 
            GET STACKED DIAGNOSTICS
                _pgstate_ = RETURNED_SQLSTATE,
                _cname_   = CONSTRAINT_NAME,
                _message_ = MESSAGE_TEXT;
            RETURN QUERY
            SELECT json_status(400, 
                               _id_, 
                               _pgstate_, 
                               CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END, 
                               _message_,
                               _ids_json_);

    END
$$
;

/* JSON STATUS */
CREATE OR REPLACE FUNCTION json_status(_status     INTEGER,
                                       _id         UUID,
                                       _pgstate    TEXT  DEFAULT '00000',
                                       _constraint TEXT  DEFAULT NULL,
                                       _message    TEXT  DEFAULT NULL,
                                       _ids        JSONB DEFAULT NULL)
    RETURNS JSONB
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    SELECT JSONB_BUILD_OBJECT
           ('status', _status,
            'id', _id, 
            'ids', _ids,
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
          '<user-id>');

SELECT * FROM "user";


SELECT * FROM "user";

SELECT * FROM pg_axios
         ('user',
           NULL,
          'DELETE',
          '<user-id>');

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
      _ids => '{"user_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
                "sign_id": "e86250ca-523d-414b-b2c1-57732d2f1b9c  ",
                "exercise_id": "f2c8731c-139e-4522-9609-94171af82c3a"
               }'
     );

SELECT * FROM "learns_sign";


SELECT * FROM "learns_sign";

SELECT *
FROM pg_axios
     ('learns_sign', 
      '{"progress": "90"}',
      'PATCH',
      _ids => '{"user_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
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
      _ids => '{"task_id": "cfc7fe0a-8bda-46e8-b180-c866c19e5ae4",
                "sign_id": "e86250ca-523d-414b-b2c1-57732d2f1b9c"
               }'
     );

SELECT * FROM "includes_sign";
*/

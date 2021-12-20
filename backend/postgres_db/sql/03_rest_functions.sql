/*************************************************************************************
 * functions for REST functionality
 * json_status and error_handler from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
 *************************************************************************************/

BEGIN;

/* Cleanup */

DROP FUNCTION IF EXISTS json_status   CASCADE;
DROP FUNCTION IF EXISTS pg_axios      CASCADE;

/* REST functions */

/* REST helpers to end all REST helpers */
/* insprired by https://stackoverflow.com/questions/17905501/postgresql-insert-data-into-table-from-json/17908760#17908760*/
CREATE OR REPLACE FUNCTION pg_axios(_table             TEXT, 
                                    _data              JSONB,
                                    _method            TEXT,
                                    _postgres_status   TEXT    DEFAULT '02000',
                                    _http_status       INTEGER DEFAULT 200,
                                    _http_error_status INTEGER DEFAULT 400)
    RETURNS TABLE (result JSONB)
LANGUAGE plpgsql
AS
$$
    DECLARE
        _data_values_ TEXT;
        _id_          UUID DEFAULT NULL;

        _constraint_  TEXT DEFAULT  _table || ' exists';
        _pgstate_     TEXT;
        _cname_       TEXT;
        _message_     TEXT;
    BEGIN
        -- collect the values that shoud be posted (provided by the json keys) in _data_values_
        SELECT STRING_AGG(QUOTE_IDENT(KEY), ',') INTO _data_values_
        FROM JSONB_OBJECT_KEYS(_data) AS X (KEY);

        IF (LOWER(_method) = 'post')
        THEN        
            -- build an INSERT query inserting only the elements of _data into _table
            -- datatypes are infered and cast from _table
            EXECUTE 'INSERT INTO ' || QUOTE_IDENT(_table) || ' (' || _data_values_ || ') '
                    || 'SELECT ' || _data_values_ ||  
                    ' FROM JSONB_POPULATE_RECORD(NULL::' || QUOTE_IDENT(_table) || ', $1) '
                    || 'RETURNING id' INTO _id_ USING _data;
        ELSE
            _constraint_ := _method || ' exists';
        END IF;

        IF (_id_ IS NOT NULL)
        THEN 
            RETURN QUERY
            SELECT json_status(_http_status, _id_);
        ELSE 
            RETURN QUERY
            SELECT json_status(_http_error_status, 
                               _id_, 
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
                               _id_, 
                               _pgstate_, 
                               CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END, 
                               _message_);

    END
$$
;

/* JSON STATUS */
CREATE OR REPLACE FUNCTION json_status(_status     INTEGER,
                                       _id         UUID,
                                       _pgstate    TEXT  DEFAULT '00000',
                                       _constraint TEXT  DEFAULT NULL,
                                       _message    TEXT  DEFAULT NULL)
    RETURNS JSONB
    IMMUTABLE PARALLEL SAFE
LANGUAGE SQL
AS
$$
    SELECT JSONB_BUILD_OBJECT
           ('status', _status,
            'id', _id,
            'pgstate', _pgstate,
            'constraint', _constraint,
            'message', _message);
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
*/
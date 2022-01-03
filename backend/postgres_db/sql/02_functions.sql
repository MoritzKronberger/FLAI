/*************************************************************************************
 * Create global functions, seperate from REST helper
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP FUNCTION IF EXISTS json_status                CASCADE;
DROP FUNCTION IF EXISTS check_password             CASCADE;
DROP FUNCTION IF EXISTS populate_spelling_exercise CASCADE;

/* JSON status */
-- build result json from pg_axios results
-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
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

/* Functions */
-- compares given password against stored hash (for user)
-- return id in result.ids and authorized in result.data
CREATE FUNCTION check_password(_login_data JSONB) 
    RETURNS TABLE (result JSONB) 
LANGUAGE plpgsql
AS
$_plpgsql_$
    DECLARE
    _password_correct_ BOOLEAN;
    _id_               UUID;
    _id_json_          JSONB DEFAULT NULL;

    _http_status_       INTEGER DEFAULT 200;
    _http_error_status_ INTEGER DEFAULT 400;
    _pgstate_           TEXT DEFAULT '02000';
    _cname_             TEXT;
    _message_           TEXT;
    BEGIN
        SELECT EXISTS (SELECT "id"
                       FROM   "user"
                       WHERE  "email" = (_login_data->> 'email')::D_EMAIL 
                              AND "password" = crypt((_login_data->> 'password')::VARCHAR, "password")
                       ),
               "id" INTO _password_correct_, _id_
        FROM   "user"
        WHERE  "email" = (_login_data->> 'email')::D_EMAIL;
        
        -- only return id if password is correct
        -- if not return unauthorized status
        IF _password_correct_ 
           AND _password_correct_  IS NOT NULL 
        THEN
            _id_json_ :=  JSONB_BUILD_OBJECT('id', _id_);
            RETURN QUERY
            SELECT json_status(_http_status_, 
                               _id_json_);
        ELSE
            RETURN QUERY
            SELECT json_status(401, 
                               _id_json_,
                               _pgstate => _pgstate_);
        END IF;

        -- in case of any uncaught exception: return it with error code
        -- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
        EXCEPTION WHEN OTHERS THEN 
        GET STACKED DIAGNOSTICS
            _pgstate_ = RETURNED_SQLSTATE,
            _cname_   = CONSTRAINT_NAME,
            _message_ = MESSAGE_TEXT;
        RETURN QUERY
        SELECT json_status(_http_error_status_, 
                           _id_json_, 
                           NULL,
                           _pgstate_, 
                           CASE WHEN _cname_ <> '' THEN _cname_ ELSE _message_ END, 
                           _message_);
    END;
$_plpgsql_$
;

-- ONLY USED TO INSERT TESTDATA, NOT FOR FINAL PRODUCTION APPLICATION WITH CMS
-- inserts a sign for each letter provided in the alphabet string
-- and adds the sign to both the 'AI Feedback' and 'Memory' task
CREATE FUNCTION populate_spelling_exercise(_alphabet TEXT, _motion_category TEXT)
    RETURNS VOID
LANGUAGE plpgsql
AS
$_plpgsql_$  
    DECLARE 
        _letters_   TEXT[];
        _letter_    TEXT;
        _i_         INTEGER DEFAULT 0;

        _s_id_     UUID;
        _mc_id_    UUID;
        _e_id_     UUID;
        _vid_id_   UUID;
        _pic_id_   UUID;
        _front_id_ UUID;
        _side_id_  UUID;
        _path_     TEXT;
    BEGIN
        _letters_ := REGEXP_SPLIT_TO_ARRAY(_alphabet, '');
        _path_ := '@/assets/signs';

        SELECT "id" FROM "e_motion_category" WHERE "name" = _motion_category       INTO _mc_id_;
        SELECT "id" FROM "exercise"          WHERE "name" = 'Buchstabieren lernen' INTO _e_id_;
        SELECT "id" FROM "e_mimetype"        WHERE "name" = 'webm'                 INTO _vid_id_;
        SELECT "id" FROM "e_mimetype"        WHERE "name" = 'webp'                 INTO _pic_id_;
        SELECT "id" FROM "e_perspective"     WHERE "name" = 'front'                INTO _front_id_;
        SELECT "id" FROM "e_perspective"     WHERE "name" = 'side'                 INTO _side_id_;

        FOREACH _letter_ IN ARRAY _letters_ LOOP

            INSERT INTO "sign" ("name", "motion_category_id")
            VALUES
            (_letter_, _mc_id_)
            RETURNING "id" INTO _s_id_;

            INSERT INTO "sign_recording" ("path", "mimetype_id", "sign_id", "perspective_id")
            VALUES
            (_path_ || '/vid/front/' || _letter_ || '_vid_front', _vid_id_, _s_id_, _front_id_),
            (_path_ || '/vid/side/'  || _letter_ || '_vid_side',  _vid_id_, _s_id_, _side_id_),
            (_path_ || '/pic/front/' || _letter_ || '_pic_front', _pic_id_, _s_id_, _front_id_),
            (_path_ || '/pic/front/' || _letter_ || '_pic_front', _pic_id_, _s_id_, _side_id_);

            INSERT INTO "includes_sign" ("exercise_id", "sign_id", "order")
            VALUES
            (_e_id_, _s_id_, _i_);
            
            _i_ := _i_ + 1;

        END LOOP;
    END
$_plpgsql_$
;

COMMIT;

/*************************************************************************************
 * Test queries for functions
 *************************************************************************************/

-- test new_exercise_settings_user_trigger and function
/*
SELECT * FROM check_password('{"email":"miriam.weber@email.com", "password":"supersecret"}');
SELECT * FROM check_password('{"email":"miriam.weber@email.com", "password":"superwrong"}');
SELECT * FROM check_password('{"email":"miriam.weber@online.com", "password":"supersecret"}');
SELECT * FROM check_password('{"email":"miriamweberemailcom", "password":"superwrong"}');
*/

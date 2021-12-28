/*************************************************************************************
 * Create global functions, seperate from REST functions
 *************************************************************************************/

BEGIN;


/* Cleanup */
DROP FUNCTION IF EXISTS populate_spelling_exercise CASCADE;


/* Functions*/

/* Compare given password against stored hash*/
/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01a.git */
CREATE FUNCTION check_password(_email VARCHAR, _password VARCHAR) RETURNS BOOLEAN AS
$_SQL_$
    SELECT EXISTS
        (SELECT *
         FROM   "user"
         WHERE  _email = "email" AND "password" = crypt(_password, "password")
        );
$_SQL_$
LANGUAGE SQL
IMMUTABLE
RETURNS NULL ON NULL INPUT;

/* inserts a sign for each letter provided in the alphabet string */
/* and adds the sign to both the 'AI Feedback' and 'Memory' task */
CREATE FUNCTION populate_spelling_exercise(_alphabet TEXT, _motion_category TEXT)
    RETURNS VOID
LANGUAGE plpgsql
AS
$_plpgsql_$  
    DECLARE 
        _letters_   TEXT[];
        _letter_    TEXT;
        _i         INTEGER DEFAULT 0;

        _s_id_     UUID;
        _mc_id_    UUID;
        _e_id_    UUID;
        _vid_id_   UUID;
        _pic_id_   UUID;
        _front_id_ UUID;
        _side_id_  UUID;
        _path_     TEXT;
    BEGIN
        _letters_ := REGEXP_SPLIT_TO_ARRAY(_alphabet, '');

        SELECT "id" FROM "e_motion_category" WHERE "name" = _motion_category       INTO _mc_id_;
        SELECT "id" FROM "exercise"          WHERE "name" = 'Buchstabieren lernen' INTO _e_id_;
        SELECT "id" FROM "e_mimetype"        WHERE "name" = 'webm'                 INTO _vid_id_;
        SELECT "id" FROM "e_mimetype"        WHERE "name" = 'png'                  INTO _pic_id_;
        SELECT "id" FROM "e_perspective"     WHERE "name" = 'front'                INTO _front_id_;
        SELECT "id" FROM "e_perspective"     WHERE "name" = 'side'                 INTO _side_id_;
        _path_     := './assets/signs';

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
            (_e_id_, _s_id_, _i);
            
            _i := _i + 1;

        END LOOP;
    END
$_plpgsql_$
;


COMMIT;

/*************************************************************************************
 * Test queries for functions
 *************************************************************************************/
/* test new_exercise_settings_user_trigger and function */
/*
SELECT * FROM check_password('miriam.weber@email.com', 'supersecret');
SELECT * FROM check_password('miriam.weber@email.com', 'notcorrect');
*/

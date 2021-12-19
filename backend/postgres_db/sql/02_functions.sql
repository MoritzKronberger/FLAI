/*************************************************************************************
 * Create global functions, seperate from REST-helpers
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
        _letters TEXT[];
        _letter  TEXT;
        _i       INTEGER DEFAULT 0;
    BEGIN
        _letters := REGEXP_SPLIT_TO_ARRAY(_alphabet, '');
        FOREACH _letter IN ARRAY _letters LOOP

            INSERT INTO "sign" ("name", "motion_category_id")
            VALUES
            (_letter, (SELECT "id" FROM "e_motion_category" WHERE "name"=_motion_category));

            INSERT INTO "includes_sign" ("task_id", "sign_id", "order")
            VALUES
            ((SELECT "id" FROM "task" WHERE "name"='AI Feedback'), 
             (SELECT "id" FROM "sign" WHERE "name"=_letter),
             _i
            ),
            ((SELECT "id" FROM "task" WHERE "name"='Memory'), 
             (SELECT "id" FROM "sign" WHERE "name"=_letter),
             _i
            );
            
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

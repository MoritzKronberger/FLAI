/*************************************************************************************
 * Create triggers and functions for flai_db_v1
 *************************************************************************************/

BEGIN;


/* Cleanup */
DROP TRIGGER IF EXISTS hash_password_trigger              ON "user"                   CASCADE;
DROP TRIGGER IF EXISTS new_exercise_settings_user_trigger ON "exercise_session"       CASCADE;
DROP TRIGGER IF EXISTS new_learns_sign_trigger            ON "exercise_settings_user" CASCADE;
DROP TRIGGER IF EXISTS update_unlocked_signs_trigger      ON "learns_sign"            CASCADE;

DROP FUNCTION IF EXISTS hash_password_function                                        CASCADE;
DROP FUNCTION IF EXISTS new_exercise_settings_user_function                           CASCADE;
DROP FUNCTION IF EXISTS new_learns_sign_function                                      CASCADE;
DROP FUNCTION IF EXISTS  update_unlocked_signs_function                               CASCADE;

/* Trigger */
-- account and authentication triggers + functions
-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
-- modified to include a check for password length and use email instead of username
CREATE FUNCTION hash_password_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN
        IF(LENGTH(NEW."password")<6)
            THEN RAISE EXCEPTION 'minimum_password_legth';
        ELSIF(TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW."password" <> OLD."password"))
            THEN NEW."password" = crypt(NEW."password", gen_salt('bf',12));
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE
ON "user"
FOR EACH ROW
    EXECUTE PROCEDURE hash_password_function()
;

-- insert new exercise_settings_user when first exercise_session for user and exercise is inserted
CREATE FUNCTION new_exercise_settings_user_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN                                
        IF(NOT EXISTS (SELECT "user_id"
                       FROM "exercise_session"
                       WHERE "user_id" = NEW."user_id"
                             AND "exercise_id" = NEW."exercise_id"))
            THEN
                INSERT INTO "exercise_settings_user" ("user_id", "exercise_id")
                VALUES
                (NEW."user_id", NEW."exercise_id");
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

CREATE TRIGGER new_exercise_settings_user_trigger
BEFORE INSERT
ON "exercise_session"
FOR EACH ROW
    EXECUTE PROCEDURE new_exercise_settings_user_function()
;

-- TODO: NULL if not custom order?
-- TODO: Cleaner solution than limit?
-- insert new learns_sign when unlocked_signs is added to in exercise_settings_user
CREATE FUNCTION new_learns_sign_function() RETURNS TRIGGER AS
$_plpgsql_$
    DECLARE
        _sign_delta_ INTEGER;
    BEGIN
        _sign_delta_ := NEW."unlocked_signs" - COALESCE(OLD."unlocked_signs", 0);

        INSERT INTO "learns_sign" ("user_id", "sign_id", "exercise_id")
        SELECT NEW."user_id", sub."sign_id", sub."exercise_id"
        FROM (SELECT DISTINCT s."id" AS "sign_id", 
                              s."name", 
                              e."id" AS "exercise_id",
                              CASE WHEN es.sort_signs_by_order THEN ins."order" END AS "custom_order"
              FROM "sign" s
              JOIN "includes_sign" ins    ON s."id" = ins."sign_id"
              JOIN "task" t               ON ins."task_id" = t."id"
              JOIN "exercise" e           ON t."exercise_id" = e."id"
              JOIN "exercise_settings" es ON e."id" = es."exercise_id"
              WHERE e."id" = NEW."exercise_id"
              ORDER BY "custom_order" ASC, s."name" ASC
              LIMIT _sign_delta_ OFFSET OLD."unlocked_signs"
        ) sub;

        RETURN NULL;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

CREATE TRIGGER new_learns_sign_trigger
AFTER INSERT OR UPDATE
ON "exercise_settings_user"
FOR EACH ROW
    EXECUTE PROCEDURE new_learns_sign_function()
;

/* Count up the corresponding unlocked_signs attribue if a signs progress reaches level_3 for the first time */
CREATE FUNCTION update_unlocked_signs_function() RETURNS TRIGGER AS
$_plpgsql_$
    DECLARE
        _level_3_ INTEGER;
    BEGIN
        _level_3_ := (SELECT "level_3" 
                      FROM "exercise_settings" 
                      WHERE "exercise_id" = NEW."exercise_id");
        IF(NEW."progress" >= _level_3_ AND NOT OLD."level_3_reached")
            THEN
                UPDATE "exercise_settings_user"
                SET "unlocked_signs" = (SELECT "unlocked_signs"
                                        FROM "exercise_settings_user"
                                        WHERE "exercise_id" = NEW."exercise_id"
                                              AND "user_id" = NEW."user_id")
                                        + 1
                WHERE "exercise_id" = NEW."exercise_id"
                      AND "user_id" = NEW."user_id";
                
                NEW."level_3_reached" = TRUE;
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

CREATE TRIGGER update_unlocked_signs_trigger
BEFORE INSERT OR UPDATE
ON "learns_sign"
FOR EACH ROW
    EXECUTE PROCEDURE update_unlocked_signs_function()
;


COMMIT;


/*************************************************************************************
 * Test queries for trigger and function development
 * (test queries might no longer work, since inserted test data has been modified)
 * TODO: Update test queries?
 *************************************************************************************/

-- test new_exercise_settings_user_trigger and function
/*
INSERT INTO "exercise_session" ("user_id", "exercise_id", "start_time")
VALUES
((SELECT "id" FROM "user"     WHERE "username"='Sabine'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP)
);

SELECT * FROM "exercise_settings_user";
*/

-- test new_learns_sign_trigger and function
/*
INSERT INTO "exercise_settings_user" ("user_id", "exercise_settings_id", "task_split", "word_length", "unlocked_signs")
VALUES 
((SELECT "id" FROM "user"    WHERE "username"='Sabine'),
 (SELECT "id" FROM "exercise WHERE "name"='Buchstabieren lernen'),
 0.5,
 3,
 3
);

SELECT * FROM "learns_sign";

UPDATE "exercise_settings_user"
SET "unlocked_signs" = 5
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Sabine')
      AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
;

SELECT * FROM "learns_sign";
*/

-- test update_unlocked_signs_trigger and function
/*
UPDATE "learns_sign"
SET "progress" = 100
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
      AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
      AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='e')
;

SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";
*/

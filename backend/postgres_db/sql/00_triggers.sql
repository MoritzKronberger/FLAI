/*************************************************************************************
 * Create triggers and functions for flai_db_v1
 *************************************************************************************/

BEGIN;


/* Cleanup */
DROP TRIGGER IF EXISTS hash_password_trigger              ON "user"                    CASCADE;
DROP TRIGGER IF EXISTS new_exercise_settings_user_trigger ON "exercise_session"       CASCADE;
DROP TRIGGER IF EXISTS new_learns_sign_trigger            ON "exercise_settings_user" CASCADE;

DROP FUNCTION IF EXISTS hash_password_function              CASCADE;
DROP FUNCTION IF EXISTS new_exercise_settings_user_function CASCADE;
DROP FUNCTION IF EXISTS new_learns_sign_function            CASCADE;


/* Trigger */

/* account and authentication triggers + functions */
/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */
/* modified to include a check for password length */
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
LANGUAGE plpgsql;

/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */
CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE
ON "user"
FOR EACH ROW
    EXECUTE PROCEDURE hash_password_function()
;

/* insert new exercise_settings_user when first exercise_session for user and exercise is inserted */
CREATE FUNCTION new_exercise_settings_user_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN                                
        IF(NOT EXISTS (SELECT "id"
                       FROM "exercise_session"
                       WHERE "user_id" = NEW."user_id"
                            AND "exercise_id" = NEW."exercise_id"))
            THEN
                INSERT INTO "exercise_settings_user" ("user_id", "exercise_settings_id")
                VALUES
                (NEW."user_id",
                 (SELECT "id" FROM "exercise_settings" WHERE "exercise_id"=NEW."exercise_id")
                );
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql;

CREATE TRIGGER new_exercise_settings_user_trigger
BEFORE INSERT
ON "exercise_session"
FOR EACH ROW
    EXECUTE PROCEDURE new_exercise_settings_user_function()
;

/* insert new learns_sign when unlocked_signs is added to in exercise_settings_user */
/* TODO: when learn_sign is no longer shared between exercises, EXCEPTION can be omitted */
CREATE FUNCTION new_learns_sign_function() RETURNS TRIGGER AS
$_plpgsql_$
    DECLARE
        _new_sign RECORD;
        _sign_delta INTEGER;
    BEGIN
        _sign_delta := NEW."unlocked_signs" - COALESCE(OLD."unlocked_signs", 0);
        IF(_sign_delta > 0)
            THEN
                FOR _new_sign IN
                    SELECT DISTINCT s."id", s."name", (CASE WHEN es.sort_signs_by_order THEN ins."order" END) AS "custom_order"
                    FROM "sign" s
                        JOIN "includes_sign" ins    ON s."id" = ins."sign_id"
                        JOIN "task" t               ON ins."task_id" = t."id"
                        JOIN "exercise" e           ON t."exercise_id" = e."id"
                        JOIN "exercise_settings" es ON e."id" = es."exercise_id"
                    WHERE es."id" = NEW."exercise_settings_id"
                    ORDER BY "custom_order" ASC, s."name" ASC
                    LIMIT _sign_delta OFFSET OLD."unlocked_signs"
                LOOP
                    BEGIN
                        INSERT INTO "learns_sign" ("user_id", "sign_id")
                        VALUES
                        (NEW."user_id", _new_sign."id");
                    EXCEPTION WHEN unique_violation THEN
                        RAISE NOTICE 'Skipping new learns_sign insertion: Row already exists';
                    END;
                END LOOP;

                RETURN NULL;
        END IF;
    END;
$_plpgsql_$
LANGUAGE plpgsql;

CREATE TRIGGER new_learns_sign_trigger
AFTER INSERT OR UPDATE
ON "exercise_settings_user"
FOR EACH ROW
    EXECUTE PROCEDURE new_learns_sign_function()
;


COMMIT;


/*************************************************************************************
 * Test queries for triggers and functions
 *************************************************************************************/

/* test new_exercise_settings_user_trigger and function */
/*
INSERT INTO "exercise_session" ("user_id", "exercise_id", "start_time")
VALUES
((SELECT "id" FROM "user"     WHERE "username"='Sabine'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP)
);

SELECT * FROM "exercise_settings_user";
*/

/* test new_learns_sign_trigger and function */
/*
INSERT INTO "exercise_settings_user" ("user_id", "exercise_settings_id", "task_split", "word_length", "unlocked_signs")
VALUES 
((SELECT "id" FROM "user" WHERE "username"='Sabine'),
 (SELECT es."id" 
  FROM "exercise_settings" es 
  JOIN "exercise" e ON es."exercise_id" = e."id" 
  WHERE e."name"='Buchstabieren lernen'),
 0.5,
 3,
 3
);

SELECT * FROM "learns_sign";

UPDATE "exercise_settings_user"
SET "unlocked_signs" = 5
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Sabine')
      AND "exercise_settings_id" = (SELECT es."id" 
                                     FROM "exercise_settings" es 
                                     JOIN "exercise" e ON es."exercise_id" = e."id" 
                                     WHERE e."name"='Buchstabieren lernen')
;

SELECT * FROM "learns_sign";
*/

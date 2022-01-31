/***************************************************************************************
 * Create triggers and functions for flai_db_v1
 *
 * Since the application should also be able to function without an internet connection,
 * all triggers regarding the learning activity must merely be optional convenience
 * and can't be used to drive the exercise procedure in the frontend.
 ***************************************************************************************/

BEGIN;


/* Cleanup */
DROP TRIGGER IF EXISTS hash_password_trigger                 ON "user"                   CASCADE;
DROP TRIGGER IF EXISTS set_unlocked_signs_to_default_trigger ON "exercise_settings_user" CASCADE;
DROP TRIGGER IF EXISTS order_not_null_trigger                ON "learns_sign"            CASCADE;
DROP TRIGGER IF EXISTS new_exercise_settings_user_trigger    ON "exercise_session"       CASCADE;
DROP TRIGGER IF EXISTS new_learns_sign_trigger               ON "exercise_settings_user" CASCADE;
DROP TRIGGER IF EXISTS update_unlocked_signs_trigger         ON "learns_sign"            CASCADE;

DROP FUNCTION IF EXISTS hash_password_function                                           CASCADE;
DROP FUNCTION IF EXISTS set_unlocked_signs_to_default_function                           CASCADE;
DROP FUNCTION IF EXISTS order_not_null_function                                          CASCADE;
DROP FUNCTION IF EXISTS new_exercise_settings_user_function                              CASCADE;
DROP FUNCTION IF EXISTS new_learns_sign_function                                         CASCADE;
DROP FUNCTION IF EXISTS update_unlocked_signs_function                                   CASCADE;


/* Trigger */
-- account and authentication triggers + functions
-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
-- modified to include a check for password length and use email instead of username
CREATE FUNCTION hash_password_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN
        IF(LENGTH(NEW."password")<9)
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

-- sets the unlocked_signs attribute to the exercises default if no value was provided
CREATE FUNCTION set_unlocked_signs_to_default_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN
        IF NEW."unlocked_signs" IS NULL
        THEN
            NEW."unlocked_signs" = (SELECT "initial_unlocked_signs"
                                    FROM   "exercise_settings"
                                    WHERE  "exercise_id" = NEW."exercise_id");  
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

CREATE TRIGGER set_unlocked_signs_to_default_trigger
BEFORE INSERT
ON "exercise_settings_user"
FOR EACH ROW
    EXECUTE PROCEDURE set_unlocked_signs_to_default_function()
;

-- enforces includes_sign order attribute to be not null if sort_signs_by_order is true in exercise_settings
CREATE FUNCTION order_not_null_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN
        IF NEW."order" IS NULL
           AND
           (SELECT "sort_signs_by_order"
            FROM   "exercise_settings"
            WHERE  "exercise_id" = NEW."exercise_id")
        THEN
            RAISE EXCEPTION 'includes_signs_order_not_null';
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql
;

CREATE TRIGGER order_not_null_trigger
BEFORE INSERT OR UPDATE
ON "includes_sign"
FOR EACH ROW
    EXECUTE PROCEDURE order_not_null_function()
;

-- insert new exercise_settings_user when first exercise_session for user and exercise is inserted
-- only insert if exercise_settings_user does not already exist
CREATE FUNCTION new_exercise_settings_user_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN                                
        IF(NOT EXISTS (SELECT "user_id"
                       FROM   "exercise_session"
                       WHERE  "user_id" = NEW."user_id"
                              AND "exercise_id" = NEW."exercise_id")
           AND
           NOT EXISTS (SELECT "user_id"
                       FROM   "exercise_settings_user"
                       WHERE  "user_id" = NEW."user_id"
                              AND "exercise_id" = NEW."exercise_id")
          )
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

-- insert new learns_sign when unlocked_signs is increased in exercise_settings_user
CREATE FUNCTION new_learns_sign_function() RETURNS TRIGGER AS
$_plpgsql_$
    DECLARE
        _sign_delta_     INTEGER;
        _old_unlock_num_ INTEGER;
    BEGIN
        -- get difference between old "unlocked_signs" value and new one
        _old_unlock_num_ := COALESCE(OLD."unlocked_signs", 0);
        _sign_delta_ := NEW."unlocked_signs" - _old_unlock_num_;

        -- only try inserting if unlocked_signs has increased
        IF _sign_delta_ > 0
        THEN
            INSERT INTO "learns_sign" ("user_id", "sign_id", "exercise_id")
            SELECT NEW."user_id", ins_q."sign_id", ins_q."exercise_id"
            FROM   (SELECT DISTINCT s."id" AS "sign_id",
                                    e."id" AS "exercise_id",
                                    -- insert new signs in the order specified in exercise_settings
                                    CASE 
                                    WHEN es.sort_signs_by_order 
                                        THEN ins."order" 
                                    ELSE
                                        DENSE_RANK() OVER(ORDER BY s."name" ASC)
                                    END AS "sign_order"
                    FROM   "sign" s
                           JOIN "includes_sign" ins    ON s."id" = ins."sign_id"
                           JOIN "exercise" e           ON ins."exercise_id" = e."id"
                           JOIN "exercise_settings" es ON e."id" = es."exercise_id"
                    WHERE  e."id" = NEW."exercise_id"
                   ) ins_q
            WHERE  ins_q."sign_order" >= _old_unlock_num_
                   AND ins_q."sign_order" < _old_unlock_num_ + _sign_delta_
            -- only insert new signs if they don't already exist
            ON CONFLICT ON CONSTRAINT learns_sign_pk DO NOTHING;
        END IF;

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

-- increase unlocked_signs if a sign's progress reaches level_3 for the first time 
---
-- ! unlocked_signs should only be increased if the new sign has not already been accounted for !
-- This is relevant in the following scenario:
-- A user is learning without an internet connection.
-- When they connect to the backend a day later their local progress should be synced.
-- They have reached level_3 on one sign and therefore unlocked a new one:
-- -> 1. exercise_settings_user is updated and unlocked_signs is increased by 1
-- -> 2. The new_learns_sign_trigger now automatically inserts a new row into learns_sign.
-- -> 3. learns_sign is now updated with the progress values made offline, but even though one sign now reaches level_3,
--       unlocked_signs should not be increased, since this is what already happened in the first step
CREATE FUNCTION update_unlocked_signs_function() RETURNS TRIGGER AS
$_plpgsql_$
    DECLARE
        _level_3_ INTEGER;
    BEGIN
        _level_3_ := (SELECT "level_3" 
                      FROM   "exercise_settings" 
                      WHERE  "exercise_id" = NEW."exercise_id");
        
        -- increase unlocked_signs if level_3 has been reached for the first time
        IF(NEW."progress" >= _level_3_ AND NOT OLD."level_3_reached")
            THEN
                -- Only increase unlocked_signs if the increase has not already happened.
                -- Since a new sign should only be added if another reaches level_3,
                -- there can only be as many signs without level 3 as were initially inserted.
                -- Therefore unlocked_signs should only be increased if less than the initial signs without progress exist
                -- (excluding the currently updated sign). 
                IF (SELECT   COUNT("user_id")
                    FROM     "learns_sign"
                    WHERE    "level_3_reached" = FALSE
                             AND "user_id" = NEW."user_id"
                             AND "exercise_id" = NEW."exercise_id"
                             AND "sign_id" <> NEW."sign_id"
                    GROUP BY "user_id", "exercise_id")
                   <
                   (SELECT "initial_unlocked_signs"
                    FROM   "exercise_settings"
                    WHERE  "exercise_id" = NEW."exercise_id")
                THEN
                    UPDATE "exercise_settings_user"
                    SET    "unlocked_signs" = (SELECT "unlocked_signs"
                                               FROM   "exercise_settings_user"
                                               WHERE  "exercise_id" = NEW."exercise_id"
                                                      AND "user_id" = NEW."user_id")
                                              + 1
                    WHERE  "exercise_id" = NEW."exercise_id"
                            AND "user_id" = NEW."user_id";
                END IF;

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
 * (some test queries might no longer work, since inserted test data has been modified)
 *************************************************************************************/

-- test order_not_null_trigger and function
/*
-- first update should raise "includes_signs_order_not_null" exception
UPDATE "includes_sign"
SET "order" = NULL
WHERE "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen');

-- second update should be allowed after updating exercise_settings
UPDATE "exercise_settings"
SET "sort_signs_by_order" = FALSE
WHERE "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen');

UPDATE "includes_sign"
SET "order" = NULL
WHERE "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen');
*/

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
-- this should (in isolation) increase unlocked_signs and add a new sign to learns_sign
SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";

UPDATE "learns_sign"
SET "progress" = 100
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
      AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
      AND "sign_id" = (SELECT "sign_id" FROM "learns_sign"
                       WHERE "level_3_reached" IS FALSE
                       AND "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
                       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
                       LIMIT 1)
;

SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";

-- this should (in isolation) not increase unlocked_signs via the trigger (at UPDATE "learns_sign")
SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";

UPDATE "exercise_settings_user"
SET "unlocked_signs" = (SELECT "unlocked_signs"
                        FROM "exercise_settings_user"
                        WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
                        AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
                       )
                       + 1
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
      AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
;

SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";

UPDATE "learns_sign"
SET "progress" = 100
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
      AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
      AND "sign_id" = (SELECT "sign_id" FROM "learns_sign"
                       WHERE "level_3_reached" IS FALSE
                       AND "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
                       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
                       LIMIT 1)
;

SELECT * FROM "learns_sign";
SELECT * FROM "exercise_settings_user";
*/

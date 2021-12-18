/*************************************************************************************
 * Create triggers and functions for flai_db_v1
 *************************************************************************************/

BEGIN;


/* Cleanup */
DROP TRIGGER IF EXISTS new_learns_sign_trigger ON excercise_settings_user CASCADE;

DROP FUNCTION IF EXISTS new_learns_sign_function CASCADE;


/* Trigger */

/* insert new excercise_settings_user when first excercise_session for user and excercise is inserted */
CREATE FUNCTION new_excercise_settings_user_function() RETURNS TRIGGER AS
$_plpgsql_$
    BEGIN                                
        IF(NOT EXISTS (SELECT "id"
                       FROM "excercise_session"
                       WHERE "user_id" = NEW."user_id"
                            AND "excercise_id" = NEW."excercise_id"))
            THEN
                INSERT INTO "excercise_settings_user" ("user_id", "excercise_settings_id")
                VALUES
                (NEW."user_id",
                 (SELECT "id" FROM "excercise_settings" WHERE "excercise_id"=NEW."excercise_id")
                );
        END IF;

        RETURN NEW;
    END;
$_plpgsql_$
LANGUAGE plpgsql;

CREATE TRIGGER new_excercise_settings_user_trigger
BEFORE INSERT
ON "excercise_session"
FOR EACH ROW
    EXECUTE PROCEDURE new_excercise_settings_user_function()
;

/* insert new learns_sign when unlocked_signs is added to in excercise_settings_user */
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
                        JOIN "includes_sign" ins     ON s."id" = ins."sign_id"
                        JOIN "task" t                ON ins."task_id" = t."id"
                        JOIN "excercise" e           ON t."excercise_id" = e."id"
                        JOIN "excercise_settings" es ON e."id" = es."excercise_id"
                    WHERE es."id" = NEW."excercise_settings_id"
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
ON "excercise_settings_user"
FOR EACH ROW
    EXECUTE PROCEDURE new_learns_sign_function()
;


COMMIT;


/*************************************************************************************
 * Test queries for triggers and functions
 *************************************************************************************/

/* test new_excercise_settings_user_trigger and function */
/*
INSERT INTO "excercise_session" ("user_id", "excercise_id", "start_time")
VALUES
((SELECT "id" FROM "user"      WHERE "username"='Sabine'), 
 (SELECT "id" FROM "excercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP)
);

SELECT * FROM "excercise_settings_user";
*/

/* test new_learns_sign_trigger and function */
/*
INSERT INTO "excercise_settings_user" ("user_id", "excercise_settings_id", "task_split", "word_length", "unlocked_signs")
VALUES 
((SELECT "id" FROM "user" WHERE "username"='Sabine'),
 (SELECT es."id" 
  FROM "excercise_settings" es 
  JOIN "excercise" e ON es."excercise_id" = e."id" 
  WHERE e."name"='Buchstabieren lernen'),
 0.5,
 3,
 3
);

SELECT * FROM "learns_sign";

UPDATE "excercise_settings_user"
SET "unlocked_signs" = 5
WHERE "user_id" = (SELECT "id" FROM "user" WHERE "username"='Sabine')
      AND "excercise_settings_id" = (SELECT es."id" 
                                     FROM "excercise_settings" es 
                                     JOIN "excercise" e ON es."excercise_id" = e."id" 
                                     WHERE e."name"='Buchstabieren lernen')
;

SELECT * FROM "learns_sign";
*/

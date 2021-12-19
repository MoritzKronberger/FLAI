/*************************************************************************************
 * Create global functions, seperate from REST-helpers
 *************************************************************************************/

BEGIN;


/* Cleanup */
DROP FUNCTION IF EXISTS populate_spelling_exercise CASCADE;


/* Functions*/

/* inserts a sign for each letter provided in the alphabet string */
/* and adds the sign to both the 'AI Feedback' and 'Memory' task */
CREATE FUNCTION populate_spelling_exercise(_alphabet TEXT, _motion_category TEXT)
    RETURNS VOID
LANGUAGE plpgsql
AS
$$  
    DECLARE _letters TEXT[];
    DECLARE _letter  TEXT;
    DECLARE _i       INTEGER DEFAULT 0;
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
$$
;


COMMIT;

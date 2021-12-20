/*************************************************************************************
 * Insert required data
 *************************************************************************************/

BEGIN;


/* sort_signs (ways signs can be ordered during an exercise) */
INSERT INTO "e_sort_signs" ("name")
VALUES
('alphabetical'),
('occurrence');

/* motion_category (determines if signs are static, dynamic or multi handed) */
INSERT INTO "e_motion_category" ("name")
VALUES
('static'),
('dynamic'),
('multi_handed');

/* perspective (the perspective a sign recording was shot from) */
INSERT INTO "e_perspective" ("name")
VALUES
('front'),
('side');

/* mimetype (used to determine the mimetype of sign recording blops) */
INSERT INTO "e_mimetype" ("name")
VALUES
('webm'),
('jpg');

/* excercise (excercises offered in the application) */
INSERT INTO "excercise" ("name", "description")
VALUES
('Buchstabieren lernen', 'Lerne in deutscher Gebärdensprache zu buchstabieren.');

/* excercise_settings */
INSERT INTO "excercise_settings" ("excercise_id", "sort_signs_id")
VALUES
((SELECT "id" FROM "excercise"    WHERE "name"='Buchstabieren lernen'),
 (SELECT "id" FROM "e_sort_signs" WHERE "name"='occurrence')
);

/* task (tasks that can be performend within an excercise) */
INSERT INTO "task" ("name", "description", "excercise_id")
VALUES
('AI Feedback', 
 'Buchstabiere in die Webcam und erhalte Feedback zu deinen Gebärden durch die FLAI-AI.', 
 (SELECT "id" FROM "excercise" WHERE "name"='Buchstabieren lernen')
),
('Memory', 
 'Ordne den gezeigten Buchstabengebärden die richtige Lösung zu.', 
 (SELECT "id" FROM "excercise" WHERE "name"='Buchstabieren lernen')
);

/* populate_spelling_excercise: */
/* inserts a sign for each letter provided in the alphabet string */
/* and adds the sign to both the 'AI Feedback' and 'Memory' task */
CREATE OR REPLACE FUNCTION populate_spelling_excercise(_alphabet TEXT, _motion_category TEXT)
    RETURNS VOID
LANGUAGE plpgsql
AS
$$  
    DECLARE _letters TEXT[];
    DECLARE _letter  TEXT;
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
             NULL
            ),
            ((SELECT "id" FROM "task" WHERE "name"='Memory'), 
             (SELECT "id" FROM "sign" WHERE "name"=_letter),
             NULL
            );

        END LOOP;
    END
$$
;

SELECT * FROM populate_spelling_excercise('abcdefghiklmnopqrstuvwxy', 'static');

COMMIT;

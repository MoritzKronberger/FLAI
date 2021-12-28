/*************************************************************************************
 * Insert required data
 *************************************************************************************/

BEGIN;


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
('webp');

/* exercise (exercises offered in the application) */
INSERT INTO "exercise" ("name", "description")
VALUES
('Buchstabieren lernen', 'Lerne in deutscher Gebärdensprache zu buchstabieren.');

/* exercise_settings with defualt settings */
INSERT INTO "exercise_settings" ("exercise_id")
VALUES
((SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'));

/* task (tasks that can be performend within an exercise) */
INSERT INTO "task" ("name", "description", "exercise_id")
VALUES
('AI Feedback', 
 'Buchstabiere in die Webcam und erhalte Feedback zu deinen Gebärden durch die FLAI-AI.', 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
),
('Memory', 
 'Ordne den gezeigten Buchstabengebärden die richtige Lösung zu.', 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
);

/* populate_spelling_exercise with static letters sorted by their occurence */
SELECT * FROM populate_spelling_exercise('enisratdhulcgmobwfkpvyxq', 'static');


COMMIT;

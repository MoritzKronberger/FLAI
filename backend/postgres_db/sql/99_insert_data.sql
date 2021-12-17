/*************************************************************************************
 * Insert required data
 *************************************************************************************/

BEGIN;


/* sort_signs (ways signs can be ordered during an exercise)*/
INSERT INTO "e_sort_signs" ("name")
VALUES
('alphabetical'),
('occurrence');

/* motion_category (determines if signs are static, dynamic or multi handed)*/
INSERT INTO "e_motion_category" ("name")
VALUES
('static'),
('dynamic'),
('multi_handed');

/* perspective (the perspective a sign recording was shot from)*/
INSERT INTO "e_perspective" ("name")
VALUES
('front'),
('side');

/* mimetype (used to determine the mimetype of sign recording blops)*/
INSERT INTO "e_mimetype" ("name")
VALUES
('webm'),
('jpg');

/* excercise (excercises offered in the application)*/
INSERT INTO "excercise" ("name", "description")
VALUES
('Buchstabieren lernen', 'Lerne in deutscher Gebärdensprache zu buchstabieren.');

/* task (tasks that can be performend within an excercise)*/
INSERT INTO "task" ("name", "description", "excercise_id")
VALUES
('AI Feedback', 
 'Buchstabiere in die Webcam und erhalte Feedback zu deinen Gebärden durch die FLAI-AI.', 
 (SELECT "id" FROM excercise WHERE "name"='Buchstabieren lernen')
),
('Memory', 
 'Ordne den gezeigten Buchstabengebärden die richtige Lösung zu.', 
 (SELECT "id" FROM excercise WHERE "name"='Buchstabieren lernen')
);


COMMIT;

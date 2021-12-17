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


COMMIT;

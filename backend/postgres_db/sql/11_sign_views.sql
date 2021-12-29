/*************************************************************************************
 * Create views for sign table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign                   CASCADE;
DROP VIEW IF EXISTS get_full_sign              CASCADE;
DROP VIEW IF EXISTS get_full_sign_for_exercise CASCADE;

/* Views */
-- returns sign with motion_category as name
CREATE VIEW get_sign ("id", "name", "motion_category")
AS
SELECT s."id", s."name", mc."name" As "motion_category"
FROM   "sign" s
       JOIN "e_motion_category" mc ON s."motion_category_id" = mc."id"
;

-- returns get_sign with exercise_id and order attributes added
CREATE VIEW get_full_sign_for_exercise ("id", "name", "motion_category", "exercise_id", "order")
AS
SELECT gs."id", gs."name", gs."motion_category", ins."exercise_id", ins."order"
FROM   get_sign gs
       JOIN "includes_sign" ins ON gs."id" = ins."sign_id"
;

COMMIT;

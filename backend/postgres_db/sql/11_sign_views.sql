/*************************************************************************************
 * Create views for sign table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign                   CASCADE;
DROP VIEW IF EXISTS get_full_sign              CASCADE;
DROP VIEW IF EXISTS get_full_sign_for_exercise CASCADE;

/* Views */
CREATE VIEW get_sign ("id", "name", "motion_category")
AS
SELECT s."id", s."name", mc."name" As "motion_category"
FROM "sign" s
     JOIN "e_motion_category" mc ON s."motion_category_id" = mc."id";

CREATE VIEW get_full_sign ("id", "name", "motion_category", "recordings")
AS
SELECT s."id", s."name", s."motion_category", ARRAY_AGG(sr."id") "recordings"
FROM get_sign s
     JOIN "sign_recording" sr ON s."id" = sr."sign_id"
GROUP BY s."id", s."name", s."motion_category";

CREATE VIEW get_full_sign_for_exercise ("id", "name", "motion_category", "recordings", "exercise_id", "order")
AS
SELECT gfs."id", gfs."name", gfs."motion_category", gfs."recordings", ins."exercise_id", ins."order"
FROM get_full_sign gfs
     JOIN "includes_sign" ins ON gfs."id" = ins."sign_id";

COMMIT;

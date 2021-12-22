/*************************************************************************************
 * Create views for sign table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign      CASCADE;
DROP VIEW IF EXISTS get_full_sign CASCADE;

/* Views */
CREATE VIEW get_sign ("id", "name", "motion_category")
AS
SELECT s."id", s."name", mc."name" As "motion_category"
FROM "sign" s
     JOIN "e_motion_category" mc ON s."motion_category_id" = mc."id";

CREATE VIEW get_full_sign ("id", "name", "motion_category", "recording")
AS
SELECT s."id", s."name", s."motion_category", JSONB_AGG(JSONB_BUILD_OBJECT('path', sr."path", 
                                                                           'mimetype', mt."name",
                                                                           'perspective', p."name")) "recording"
FROM get_sign s
     JOIN "sign_recording" sr ON s."id" = sr."sign_id"
     JOIN "e_mimetype" mt     ON sr."mimetype_id" = mt."id"
     JOIN "e_perspective" p   ON sr."perspective_id" = p."id"
GROUP BY s."id", s."name", s."motion_category";

COMMIT;

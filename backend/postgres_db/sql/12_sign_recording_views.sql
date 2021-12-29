/*************************************************************************************
 * Create views for sign_recording table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign_recording CASCADE;

/* Views */
CREATE VIEW get_sign_recording ("id", "path", "mimetype", "perspective", "sign_id")
AS
SELECT sr."id", sr."path", mt."name" AS "mimetype", p."name" AS "perspective", sr."sign_id"
FROM   "sign_recording" sr
       JOIN "e_mimetype" mt   ON sr."mimetype_id" = mt."id"
       JOIN "e_perspective" p ON sr."perspective_id" = p."id"
;

COMMIT;

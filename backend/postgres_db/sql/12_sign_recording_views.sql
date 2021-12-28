/*************************************************************************************
 * Create views for sign_recording table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign_recording CASCADE;

/* Views */
-- returns sign_recording with mimetype and perspective as names
CREATE VIEW get_sign_recording ("id", "path", "mimetype", "perspective")
AS
SELECT sr."id", sr."path", mt."name" As "mmimetype", p."name" AS "perspective"
FROM   "sign_recording" sr
       JOIN "e_mimetype" mt   ON sr."mimetype_id" = mt."id"
       JOIN "e_perspective" p ON sr."perspective_id" = p."id"
;

COMMIT;

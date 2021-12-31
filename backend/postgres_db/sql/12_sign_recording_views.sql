/*************************************************************************************
 * Create views for sign_recording table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_sign_recording CASCADE;

/* Views */
-- returns sign_recording mimetype and perspective as string
CREATE VIEW get_sign_recording ("id", "path", "mimetype", "perspective", "sign_id")
AS
SELECT sr."id", sr."path", mt."name" AS "mimetype", p."name" AS "perspective", sr."sign_id"
FROM   "sign_recording" sr
       JOIN "e_mimetype" mt   ON sr."mimetype_id" = mt."id"
       JOIN "e_perspective" p ON sr."perspective_id" = p."id"
;

-- returns get_sign_recording with exercise_id attribute added
CREATE VIEW get_sign_recording_for_exercise ("id", "path", "mimetype", "perspective", "sign_id", "exercise_id")
AS
SELECT gsr."id", gsr."path", gsr."mimetype", gsr."perspective", gsr."sign_id", ins."exercise_id"
FROM   get_sign_recording gsr
       JOIN "includes_sign" ins ON gsr."sign_id" = ins."sign_id"    
;

COMMIT;

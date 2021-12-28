/*************************************************************************************
 * Create views for task table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_task      CASCADE;
DROP VIEW IF EXISTS get_full_task CASCADE;

/* Views */
-- returns regular task
CREATE VIEW get_task ("id", "name", "description")
AS
SELECT "id", "name", "description"
FROM   "task"
;

-- returns task with all included signs as a json aggregate (including the sign_id and its order attribute)
CREATE VIEW get_full_task ("id", "name", "description", "signs")
AS
SELECT   t."id", t."name", t."description", JSONB_AGG(JSONB_BUILD_OBJECT('id', ins."sign_id",
                                                                         'order', ins."order")) "signs"
FROM     get_task t
         JOIN "includes_sign" ins ON ins."task_id" = t."id"
GROUP BY t."id", t."name", t."description"
;

COMMIT;

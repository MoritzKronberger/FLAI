/*************************************************************************************
 * Create views for task table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_task      CASCADE;
DROP VIEW IF EXISTS get_full_task CASCADE;

/* Views */
CREATE VIEW get_task ("id", "name", "description")
AS
SELECT "id", "name", "description"
FROM "task";

CREATE VIEW get_full_task ("id", "name", "description", "signs")
AS
SELECT t."id", t."name", t."description", ARRAY_AGG(ins."sign_id") "signs"
FROM get_task t
     JOIN "includes_sign" ins ON ins."task_id" = t."id"
GROUP BY t."id", t."name", t."description";

COMMIT;

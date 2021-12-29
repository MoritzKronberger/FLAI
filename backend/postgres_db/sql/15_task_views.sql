/*************************************************************************************
 * Create views for task table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_task      CASCADE;
DROP VIEW IF EXISTS get_full_task CASCADE;

/* Views */
CREATE VIEW get_task ("id", "name", "description", "exercise_id")
AS
SELECT "id", "name", "description", "exercise_id"
FROM   "task";

COMMIT;

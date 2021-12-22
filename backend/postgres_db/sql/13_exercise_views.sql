/*************************************************************************************
 * Create views for exercise table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_exercise      CASCADE;
DROP VIEW IF EXISTS get_full_exercise CASCADE;

/* Views */
CREATE VIEW get_exercise ("id", "name", "description")
AS
SELECT "id", "name", "description"
FROM "exercise";

CREATE VIEW get_full_exercise ("id", "name", "description", "level_1", "level_2", "level_3", "sort_signs_by_order", "tasks")
AS
SELECT e."id", e."name", e."description", 
       es."level_1", es."level_2", es."level_3", es."sort_signs_by_order", 
       ARRAY_AGG(t."id") "tasks"
FROM get_exercise e
     JOIN "exercise_settings" es ON e."id" = es."exercise_id"
     JOIN "task" t               ON e."id" = t."exercise_id"
GROUP BY e."id", e."name", e."description", es."level_1", es."level_2", es."level_3", es."sort_signs_by_order";

COMMIT;

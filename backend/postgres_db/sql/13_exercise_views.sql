/*************************************************************************************
 * Create views for exercise table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_exercise               CASCADE;
DROP VIEW IF EXISTS get_full_exercise          CASCADE;
DROP VIEW IF EXISTS get_full_exercise_for_user CASCADE;

/* Views */
-- returns regular exercise
CREATE VIEW get_exercise ("id", "name", "description")
AS
SELECT "id", "name", "description"
FROM   "exercise"
;

-- returns exercise including its global settings
CREATE VIEW get_full_exercise ("id", "name", "description", "level_1", "level_2", "level_3", "sort_signs_by_order", "tasks")
AS
SELECT   e."id", e."name", e."description", 
         es."level_1", es."level_2", es."level_3", es."sort_signs_by_order", 
         ARRAY_AGG(t."id") "tasks"
FROM     get_exercise e
         JOIN "exercise_settings" es ON e."id" = es."exercise_id"
         JOIN "task" t               ON e."id" = t."exercise_id"
GROUP BY e."id", e."name", e."description", es."level_1", es."level_2", es."level_3", es."sort_signs_by_order"
;

-- returns exercise with both global and user specific settings
CREATE VIEW get_full_exercise_for_user ("id", "user_id", "name", "description", 
                                        "level_1", "level_2", "level_3", "sort_signs_by_order", 
                                        "task_split", "word_length", "unlocked_signs",
                                        "tasks")
AS SELECT fe."id", esu."user_id", fe."name", fe."description", 
          fe."level_1", fe."level_2", fe."level_3", fe."sort_signs_by_order", 
          esu."task_split", esu."word_length", esu."unlocked_signs",
          fe."tasks"
FROM      get_full_exercise fe
          JOIN "exercise_settings_user" esu ON fe."id" = esu."exercise_id"
;

COMMIT;

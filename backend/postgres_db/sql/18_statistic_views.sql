/*************************************************************************************
 * Create views for statistics
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_time_learnt_by_day CASCADE;
DROP VIEW IF EXISTS get_target_time_reached_by_day CASCADE;

/* Views */
CREATE VIEW get_time_learnt_by_day ("user_id", "day", "time_learnt")
AS
SELECT "user_id", DATE_TRUNC('day', "start_time"), SUM("session_duration") AS "time_learnt"
FROM "exercise_session"
GROUP BY "user_id", DATE_TRUNC('day', "start_time");

CREATE VIEW get_target_time_reached_by_day ("user_id", "day", "target_time_reached")
AS
SELECT "user_id", "day", ("time_learnt" >= "target_learning_time") AS "time_learnt"
FROM get_time_learnt_by_day tld
     JOIN "user" u ON tld."user_id" = u."id";

COMMIT;
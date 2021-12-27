/*************************************************************************************
 * Create views for statistics
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_time_learnt_by_day         CASCADE;
DROP VIEW IF EXISTS get_target_time_reached_by_day CASCADE;
DROP VIEW IF EXISTS get_streaks                    CASCADE;
DROP VIEW IF EXISTS get_active_streak              CASCADE;
DROP VIEW IF EXISTS get_longest_streak             CASCADE;
DROP VIEW IF EXISTS get_total_exercise_progress    CASCADE;

/* TIME BASED VIEWS */
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

CREATE VIEW get_streaks ("user_id", "start_day", "end_day", "streak")
AS
SELECT "user_id", MIN("day") AS "start_day", MAX("day") AS "end_day", COUNT("day") AS "streak"
FROM (SELECT "user_id", 
             "day", 
             -- inspired by https://newbedev.com/sql-count-consecutive-days
             -- rank all days in ascending order partitioned by user
             -- consecutive days will have the same norm_day value
             -- this is because both their rank and day increase by 1 when stepping through the order
             DATE_PART('day',"day") - (DENSE_RANK() OVER(PARTITION BY "user_id" ORDER BY "day" ASC)) AS "norm_day"
      FROM get_target_time_reached_by_day
      WHERE "target_time_reached" IS TRUE
     ) sub
GROUP BY sub."user_id", sub."norm_day"
;

CREATE VIEW get_active_streak ("user_id", "streak")
AS
SELECT "user_id", "streak"
FROM get_streaks
WHERE "end_day" >= DATE_TRUNC('day', CURRENT_TIMESTAMP - INTERVAL '1 day')
;

CREATE VIEW get_longest_streak ("user_id", "start_day", "end_day", "streak")
AS
SELECT "user_id", "start_day", "end_day", "streak"
FROM 
    (SELECT "user_id", "start_day", "end_day", "streak", (DENSE_RANK() OVER(PARTITION BY "user_id" ORDER BY "streak" DESC)) AS "s_rank"
     FROM get_streaks) sub
WHERE sub."s_rank" = 1
;

/* PROGRESS BASED VIEWS */
CREATE VIEW get_total_exercise_progress ("user_id", "exercise_id", "total_progress", "level_3")
AS
-- Progress is counted even above level_3, so that mistakes do not immediately se users back behind level_3,
-- however for statistics purposes, the progress is capped at level_3 using LEAST.
SELECT "user_id", ls."exercise_id", SUM(LEAST(ls."progress", es."level_3")), es."level_3"
FROM "learns_sign" ls
     JOIN "exercise_settings" es ON ls."exercise_id" = es."exercise_id"
GROUP BY "user_id", ls."exercise_id", es."level_3";

COMMIT;
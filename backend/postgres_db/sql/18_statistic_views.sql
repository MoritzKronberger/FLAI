/*************************************************************************************
 * Create views for statistics
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_time_learnt_by_day         CASCADE;
DROP VIEW IF EXISTS get_target_time_reached_by_day CASCADE;
DROP VIEW IF EXISTS get_streaks                    CASCADE;

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

COMMIT;
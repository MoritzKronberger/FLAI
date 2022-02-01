/*************************************************************************************
 * Create views for statistics
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_time_learnt_by_day               CASCADE;
DROP VIEW IF EXISTS get_target_time_reached_by_day       CASCADE;
DROP VIEW IF EXISTS get_streaks                          CASCADE;
DROP VIEW IF EXISTS get_active_streak                    CASCADE;
DROP VIEW IF EXISTS get_longest_streak                   CASCADE;
DROP VIEW IF EXISTS get_total_exercise_progress          CASCADE;
DROP VIEW IF EXISTS get_exercise_completion_progress     CASCADE;
DROP VIEW IF EXISTS get_completed_exercises              CASCADE;
DROP VIEW IF EXISTS get_exercise_completion_sign_unlocks CASCADE;
DROP VIEW IF EXISTS get_best_exercise_sign               CASCADE;

/* TIME BASED VIEWS */
-- days are not counted in time.now - 24 hours
-- instead days are split by the day date component
-- TODO: verify correct behavior with different and changing timezones

-- returns the sum of session_durations on one day
CREATE VIEW get_time_learnt_by_day ("user_id", "day", "time_learnt")
AS
SELECT   "user_id", DATE_TRUNC('day', "start_time"), SUM("session_duration") AS "time_learnt"
FROM     "exercise_session"
GROUP BY "user_id", DATE_TRUNC('day', "start_time")
;

-- [helper] returns a boolean value indicating if the user has reached their target_learning_time on a day
CREATE VIEW get_target_time_reached_by_day ("user_id", "day", "target_time_reached")
AS
SELECT "user_id", "day", ("time_learnt" >= "target_learning_time") AS "time_learnt"
FROM   get_time_learnt_by_day tld
       JOIN "user" u ON tld."user_id" = u."id"
;

-- [helper] returns the start day, end day and amount of days on which a user consecutively reached their target_learning_time
CREATE VIEW get_streaks ("user_id", "start_day", "end_day", "streak")
AS
SELECT   "user_id", MIN("day") AS "start_day", MAX("day") AS "end_day", COUNT("day") AS "streak"
FROM     (SELECT "user_id", 
                 "day", 
                 -- inspired by https://newbedev.com/sql-count-consecutive-days
                 -- rank all days in ascending order partitioned by user
                 -- consecutive days will have the same norm_day value
                 -- this is because both their rank and day increase by 1 when stepping through the order
                 DATE_PART('day',"day") - (DENSE_RANK() OVER(PARTITION BY "user_id" ORDER BY "day" ASC)) AS "norm_day"
          FROM   get_target_time_reached_by_day
          WHERE  "target_time_reached" IS TRUE
         ) sub
GROUP BY sub."user_id", sub."norm_day"
;

-- returns the user's streak length if it is not older than one day (-> streak can still be kept alive)
CREATE VIEW get_active_streak ("user_id", "streak")
AS
SELECT "user_id", "streak"
FROM   get_streaks
WHERE  "end_day" >= DATE_TRUNC('day', CURRENT_TIMESTAMP - INTERVAL '1 day')
;

-- returns the longest ever streak a user has completed
CREATE VIEW get_longest_streak ("user_id", "start_day", "end_day", "streak")
AS
SELECT "user_id", "start_day", "end_day", "streak"
FROM 
       (SELECT "user_id", "start_day", "end_day", "streak", 
               (DENSE_RANK() OVER(PARTITION BY "user_id" ORDER BY "streak" DESC)) AS "s_rank"
        FROM   get_streaks) sub
WHERE  sub."s_rank" = 1
;

/* PROGRESS BASED VIEWS */
-- in the app itself progress is counted even above level_3, so that mistakes do not immediately set users back behind level_3
-- however for statistics purposes, the progress is usually capped at level_3

-- [helper] returns the sum of all progress a user has made in one exercise
CREATE VIEW get_total_exercise_progress ("user_id", "exercise_id", "total_progress", "level_3")
AS
-- cap individual progress levels at level_3 using LEAST
SELECT   "user_id", ls."exercise_id", SUM(LEAST(ls."progress", es."level_3")), es."level_3"
FROM     "learns_sign" ls
         JOIN "exercise_settings" es ON ls."exercise_id" = es."exercise_id"
GROUP BY "user_id", ls."exercise_id", es."level_3"
;

-- returns the fraction of all possible progress a user has reached in one exercise
CREATE VIEW get_exercise_completion_progress ("user_id", "exercise_id", "progress_completion")
AS
SELECT   gtep."user_id", gtep."exercise_id", 
         gtep."total_progress"::REAL / (COUNT(DISTINCT ins."sign_id") * gtep."level_3") AS "progress_completion"
FROM     get_total_exercise_progress gtep
         JOIN includes_sign ins ON gtep."exercise_id" = ins."exercise_id"
GROUP BY gtep."user_id", gtep."exercise_id", gtep."total_progress", gtep."level_3"
;

-- returns exercises a user has reached all possible progress on
CREATE VIEW get_completed_exercises ("user_id", "exercise_id")
AS
SELECT "user_id", "exercise_id"
FROM   get_exercise_completion_progress
WHERE  "progress_completion" = 1
;

-- returns the fraction of all possible sign unlocks a user has achieved in one exercise
CREATE VIEW get_exercise_completion_sign_unlocks ("user_id", "exercise_id", "sign_unlock_completion")
AS
SELECT   ls."user_id", ls."exercise_id", 
         COUNT(DISTINCT ls."sign_id")::REAL / COUNT(DISTINCT ins."sign_id") AS "sign_unlock_completion"
FROM     "learns_sign" ls
         JOIN "includes_sign" ins ON ls."exercise_id" = ins."exercise_id"
GROUP BY ls."user_id", ls."exercise_id"
;

-- returns the sign a user has made the most progress on in one exercise
-- in this case the progress is not capped at level_3
CREATE VIEW get_best_exercise_sign ("user_id", "exercise_id", "sign_id", "sign_name")
AS
SELECT "user_id", "exercise_id", "sign_id", s."name" As "sign_name"
FROM
       (SELECT "user_id", "exercise_id", "sign_id", 
               (DENSE_RANK() OVER(PARTITION BY "user_id", "exercise_id" ORDER BY "progress" DESC)) AS "p_rank"
        FROM   "learns_sign") sub
       JOIN "sign" s ON sub."sign_id" = s."id"
WHERE  "p_rank" = 1
;

COMMIT;

/****************************************************************************************
 * Test queries for views
 ****************************************************************************************/

-- select all rows from all statistics-views
/*
SELECT * FROM get_time_learnt_by_day;
SELECT * FROM get_target_time_reached_by_day;
SELECT * FROM get_streaks;
SELECT * FROM get_active_streak;
SELECT * FROM get_longest_streak;
SELECT * FROM get_total_exercise_progress;
SELECT * FROM get_exercise_completion_progress;
SELECT * FROM get_completed_exercises;
SELECT * FROM get_exercise_completion_sign_unlocks;
SELECT * FROM get_best_exercise_sign;
*/

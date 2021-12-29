/*************************************************************************************
 * Create views for exercise_session table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_exercise_session        CASCADE;
DROP VIEW IF EXISTS get_active_exercise_session CASCADE;

/* Views */
-- returns regular exercise_session
CREATE VIEW get_exercise_session ("exercise_id", "user_id", "start_time", "session_duration")
AS
SELECT "exercise_id", "user_id", "start_time", "session_duration"
FROM   "exercise_session"
;

-- returns exercise sessions that have not been completed yet
CREATE VIEW get_active_exercise_session ("exercise_id", "user_id", "start_time")
AS
SELECT "exercise_id", "user_id", "start_time"
FROM   get_exercise_session
WHERE  "session_duration" IS NULL
;

COMMIT;

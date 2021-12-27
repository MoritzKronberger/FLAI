/*************************************************************************************
 * Create views for user table
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_user CASCADE;

/* Views */
CREATE VIEW get_user ("id", "email", "username", "right_handed", "target_learning_time")
AS
SELECT "id", "email", "username", "right_handed", "target_learning_time"
FROM   "user"
;

COMMIT;

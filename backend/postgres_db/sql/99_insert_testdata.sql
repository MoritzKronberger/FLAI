/*************************************************************************************
 * Insert test data
 *************************************************************************************/

BEGIN;


/* users (test users based on personas) */
INSERT INTO "user" ("email", "username", "password", "right_handed", "target_learning_time")
VALUES
('miriam.weber@email.com', 'Miriam', 'supersecret', TRUE, '60 min'),
('katharina_hoff@email.com', 'Katharina', 'supersecret', FALSE, '20 min'),
('sabine.toth@email.com', 'Sabine', 'supersecret', TRUE, '15 min');

/* exercise sessions (the test users' learning sessions) */
INSERT INTO "exercise_session" ("user_id", "exercise_id", "start_time", "session_duration")
VALUES
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '48 hours'), 
'63 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '20 minutes'), 
NULL
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '2 hours'), 
'15 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '1 hour'), 
'8 min'
);


COMMIT;

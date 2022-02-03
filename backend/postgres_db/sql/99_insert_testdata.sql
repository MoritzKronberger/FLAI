/***************************************************************************************
 * Insert test data
 * The data is only inserted for testing purposes.
 * In the production application this data is provided by the users trough the frontend.
 ***************************************************************************************/

BEGIN;

/* Insert data */
-- users (test users based on personas)
INSERT INTO "user" ("email", "username", "password", "right_handed", "target_learning_time")
VALUES
('miriam.weber@email.com', 'Miriam', 'supersecret', TRUE, '20 min'),
('katharina_hoff@email.com', 'Katharina', 'supersecret', FALSE, '20 min'),
('sabine.toth@email.com', 'Sabine', 'supersecret', TRUE, '15 min');

-- exercise sessions (the test users' learning sessions)
INSERT INTO "exercise_session" ("user_id", "exercise_id", "start_time", "session_duration")
VALUES
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '20 minutes'), 
'22 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '2 hours'), 
'15 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '1 hours'), 
'15 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '2 day 18 hours'), 
'27 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '1 day'), 
'23 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '2 day'), 
'29 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '3 day'), 
'24 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '4 day'), 
'26 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '5 day'), 
'12 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '6 day'), 
'23 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '7 day'), 
'28 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '8 day'), 
'32 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '9 day'), 
'21 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '10 day'), 
'20 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '11 day'), 
'30 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '12 day'), 
'23 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '13 day'), 
'27 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '14 day'), 
'20 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Miriam'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '15 day'), 
'27 min'
),
((SELECT "id" FROM "user"     WHERE "username"='Katharina'), 
 (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen'),
 (CURRENT_TIMESTAMP - INTERVAL '1 day 3 hours'), 
'25 min'
);

-- update progress (simulate users making progress)
UPDATE "learns_sign"
SET    "progress" = 82
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='e')
;
UPDATE "learns_sign"
SET    "progress" = 34
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='n')
;
UPDATE "learns_sign"
SET    "progress" = 105
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Miriam')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='i')
;
UPDATE "learns_sign"
SET    "progress" = 87
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Katharina')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='e')
;
UPDATE "learns_sign"
SET    "progress" = 95
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Katharina')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='n')
;
UPDATE "learns_sign"
SET    "progress" = 64
WHERE  "user_id" = (SELECT "id" FROM "user" WHERE "username"='Katharina')
       AND "exercise_id" = (SELECT "id" FROM "exercise" WHERE "name"='Buchstabieren lernen')
       AND "sign_id" = (SELECT "id" FROM "sign" WHERE "name"='i')
;

COMMIT;

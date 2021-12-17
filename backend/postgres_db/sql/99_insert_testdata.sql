/*************************************************************************************
 * Insert test data
 *************************************************************************************/

BEGIN;


/* users (test users based on personas)*/
INSERT INTO "user" ("email", "username", "password", "right_handed", "target_learning_time")
VALUES
('miriam.weber@email.com', 'Miriam', 'supersecret', TRUE, '60 min'),
('katharina_hoff@email.com', 'Katharina', 'supersecret', FALSE, '20 min'),
('sabine.toth@email.com', 'Sabine', 'supersecret', TRUE, '15 min');


COMMIT;
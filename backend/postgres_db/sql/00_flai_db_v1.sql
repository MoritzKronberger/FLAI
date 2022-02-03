/*************************************************************************************
 * Create tables for flai_db_v1
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP DOMAIN IF EXISTS D_UNTAINTED             CASCADE;
DROP DOMAIN IF EXISTS D_EMAIL                 CASCADE;

DROP TABLE IF EXISTS "e_motion_category"      CASCADE;
DROP TABLE IF EXISTS "e_perspective"          CASCADE;
DROP TABLE IF EXISTS "e_mimetype"             CASCADE;
DROP TABLE IF EXISTS "user"                   CASCADE;
DROP TABLE IF EXISTS "exercise"               CASCADE;
DROP TABLE IF EXISTS "exercise_settings"      CASCADE;
DROP TABLE IF EXISTS "exercise_session"       CASCADE;
DROP TABLE IF EXISTS "task"                   CASCADE;
DROP TABLE IF EXISTS "sign"                   CASCADE;
DROP TABLE IF EXISTS "sign_recording"         CASCADE;
DROP TABLE IF EXISTS "includes_sign"          CASCADE;
DROP TABLE IF EXISTS "learns_sign"            CASCADE;
DROP TABLE IF EXISTS "exercise_settings_user" CASCADE;

/* Create Domains */
-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
CREATE DOMAIN D_UNTAINTED
AS VARCHAR CHECK (value !~ '[<>"'';]|--|/\*');

-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
CREATE DOMAIN D_EMAIL
AS
VARCHAR
CHECK (value ~* '\A(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])\Z');

/* Create tables */
CREATE TABLE "e_motion_category"
("id"   UUID        NOT NULL DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_motion_category_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_motion_category_unique_name
    UNIQUE ("name")
);

CREATE TABLE "e_perspective"
("id"   UUID        NOT NULL DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_perspective_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_perspective_unique_name
    UNIQUE ("name")
);

CREATE TABLE "e_mimetype"
("id"   UUID        NOT NULL DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_mimetype_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_mimetype_unique_name
    UNIQUE ("name")
);

-- from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
CREATE TABLE "user" 
("id"                   UUID        NOT NULL DEFAULT gen_random_uuid(),
 "email"                D_EMAIL     NOT NULL,
 "username"             D_UNTAINTED NOT NULL,
 "password"             VARCHAR     NOT NULL,
 "right_handed"         BOOLEAN     NOT NULL DEFAULT TRUE,
 "target_learning_time" INTERVAL    NOT NULL DEFAULT '20 min',

 CONSTRAINT user_pk
    PRIMARY KEY ("id"),

 CONSTRAINT user_unique_email
    UNIQUE ("email"),

  CONSTRAINT user_username_length
    CHECK (LENGTH("username")<31)
);

CREATE TABLE "exercise" 
("id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
 "name"        D_UNTAINTED NOT NULL,
 "description" D_UNTAINTED NOT NULL,

 CONSTRAINT exercise_pk
    PRIMARY KEY ("id"),

 CONSTRAINT exercise_unique_name
    UNIQUE ("name")
);

CREATE TABLE "exercise_settings" 
("id"                     UUID    NOT NULL DEFAULT gen_random_uuid(),
 "level_1"                INTEGER          DEFAULT 20,
 "level_2"                INTEGER          DEFAULT 50,
 "level_3"                INTEGER NOT NULL DEFAULT 80,
 "progress_add"           INTEGER NOT NULL DEFAULT 20,
 "progress_sub"           INTEGER NOT NULL DEFAULT -5,
 "exercise_id"            UUID    NOT NULL,
 "sort_signs_by_order"    BOOLEAN NOT NULL DEFAULT TRUE,
 "initial_unlocked_signs" INTEGER NOT NULL DEFAULT 3,

 CONSTRAINT exercise_settings_pk
    PRIMARY KEY ("id"),

 CONSTRAINT exercise_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE
);

CREATE TABLE "exercise_session" 
("user_id"          UUID                     NOT NULL,
 "exercise_id"      UUID                     NOT NULL,
 "start_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
 "session_duration" INTERVAL,

 CONSTRAINT exercise_session_pk
    PRIMARY KEY ("user_id", "exercise_id", "start_time"),

 CONSTRAINT exercise_session_fk_user_id
    FOREIGN KEY ("user_id")     REFERENCES "user" ("id")     ON DELETE CASCADE,

 CONSTRAINT exercise_session_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE
);

CREATE TABLE "task" 
("id"          UUID         NOT NULL DEFAULT gen_random_uuid(),
 "name"        D_UNTAINTED  NOT NULL,
 "description" D_UNTAINTED,
 "exercise_id" UUID         NOT NULL,

 CONSTRAINT task_pk
    PRIMARY KEY ("id"),

 CONSTRAINT task_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE,

 CONSTRAINT task_unique_name_and_exercise_id
    UNIQUE ("name", "exercise_id")
);

CREATE TABLE "sign" 
("id"                 UUID        NOT NULL DEFAULT gen_random_uuid(),
 "name"               D_UNTAINTED NOT NULL,
 "motion_category_id" UUID        NOT NULL,

 CONSTRAINT sign_pk
    PRIMARY KEY ("id"),

 CONSTRAINT sign_fk_motion_category_id
    FOREIGN KEY ("motion_category_id") REFERENCES "e_motion_category" ("id") ON DELETE CASCADE,

 CONSTRAINT sign_unique_name
    UNIQUE ("name")
);

CREATE TABLE "sign_recording" 
("id"             UUID    NOT NULL DEFAULT gen_random_uuid(),
 "path"           VARCHAR NOT NULL,
 "mimetype_id"    UUID    NOT NULL,
 "sign_id"        UUID    NOT NULL,
 "perspective_id" UUID,

 CONSTRAINT sign_recording_pk
    PRIMARY KEY ("id"),

 CONSTRAINT sign_recording_fk_mimetype_id
    FOREIGN KEY ("mimetype_id")    REFERENCES "e_mimetype" ("id")    ON DELETE CASCADE,

 CONSTRAINT sign_recording_fk_sign_id
    FOREIGN KEY ("sign_id")        REFERENCES "sign" ("id")          ON DELETE CASCADE,

 CONSTRAINT sign_recording_fk_perspective_id
    FOREIGN KEY ("perspective_id") REFERENCES "e_perspective" ("id") ON DELETE CASCADE
);

CREATE TABLE "includes_sign" 
("exercise_id" UUID    NOT NULL,
 "sign_id"     UUID    NOT NULL,
 "order"       INTEGER,

 CONSTRAINT includes_sign_pk
    PRIMARY KEY ("exercise_id", "sign_id"),

 CONSTRAINT includes_sign_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE,

 CONSTRAINT includes_sign_fk_sign_id
    FOREIGN KEY ("sign_id")     REFERENCES "sign" ("id")     ON DELETE CASCADE,

 CONSTRAINT includes_sign_unique_order_per_exercise
    UNIQUE ("exercise_id", "order")
);

CREATE TABLE "learns_sign" 
("user_id"         UUID    NOT NULL,
 "sign_id"         UUID    NOT NULL,
 "exercise_id"     UUID    NOT NULL,
 "progress"        INTEGER NOT NULL DEFAULT 0,
 "intro_done"      BOOLEAN NOT NULL DEFAULT FALSE,
 "level_3_reached" BOOLEAN NOT NULL DEFAULT FALSE,

 CONSTRAINT learns_sign_pk
    PRIMARY KEY ("user_id", "sign_id", "exercise_id"),

 CONSTRAINT learns_sign_fk_user_id
    FOREIGN KEY ("user_id")     REFERENCES "user" ("id")     ON DELETE CASCADE,

 CONSTRAINT learns_sign_fk_sign_id
    FOREIGN KEY ("sign_id")     REFERENCES "sign" ("id")     ON DELETE CASCADE,

 CONSTRAINT learns_sign_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE,

 CONSTRAINT learns_sign_progress_not_negative
    CHECK ("progress" >= 0)
);

CREATE TABLE "exercise_settings_user" 
("user_id"        UUID    NOT NULL,
 "exercise_id"    UUID    NOT NULL,
 "task_split"     REAL             DEFAULT 0.5,
 "word_length"    INTEGER          DEFAULT 4,
 "unlocked_signs" INTEGER NOT NULL,

 CONSTRAINT exercise_settings_user_pk
    PRIMARY KEY ("user_id", "exercise_id"),

 CONSTRAINT exercise_settings_user_fk_user_id
    FOREIGN KEY ("user_id")     REFERENCES "user" ("id")     ON DELETE CASCADE,

 CONSTRAINT exercise_settings_user_fk_exercise_id
    FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id") ON DELETE CASCADE,

 CONSTRAINT exercise_settings_user_word_length_not_negative
    CHECK ("word_length" >= 0),

 CONSTRAINT exercise_settings_user_task_split_between_0_1
    CHECK ("task_split" >= 0 AND "task_split" <= 1)
);

COMMIT;

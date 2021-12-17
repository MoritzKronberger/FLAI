/*************************************************************************************
 * Create tables for flai_db_v1
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP DOMAIN IF EXISTS D_UNTAINTED CASCADE;
DROP DOMAIN IF EXISTS D_EMAIL     CASCADE;


/* Create Domains */

/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */
CREATE DOMAIN D_UNTAINTED
AS VARCHAR CHECK (value !~ '[<>"'';]|--|/\*');

/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */
CREATE DOMAIN D_EMAIL
AS
VARCHAR
CHECK (value ~* '\A(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])\Z');


/* Create tables */

CREATE TABLE "e_sort_signs"
("id"   UUID        DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_sort_signs_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_sort_signs_unique_name
    UNIQUE ("name")
);

CREATE TABLE "e_motion_category"
("id"   UUID        DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_motion_category_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_motion_category_unique_name
    UNIQUE ("name")
);

CREATE TABLE "e_perspective"
("id"   UUID        DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_perspective_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_perspective_unique_name
    UNIQUE ("name")
);

CREATE TABLE "e_mimetype"
("id"   UUID        DEFAULT gen_random_uuid(),
 "name" D_UNTAINTED NOT NULL,

 CONSTRAINT e_mimetype_pk
    PRIMARY KEY ("id"),

 CONSTRAINT e_mimetype_unique_name
    UNIQUE ("name")
);

/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */
CREATE TABLE "user" 
("id"                   UUID        DEFAULT gen_random_uuid(),
 "email"                D_EMAIL     NOT NULL,
 "username"             D_UNTAINTED NOT NULL,
 "password"             VARCHAR     NOT NULL,
 "right_handed"         BOOLEAN     DEFAULT TRUE,
 "target_learning_time" INTERVAL    DEFAULT '20 min',

 CONSTRAINT user_pk
    PRIMARY KEY ("id"),

 CONSTRAINT user_unique_email
    UNIQUE ("email"),

  CONSTRAINT user_username_length
    CHECK (LENGTH("username")<31)
);

CREATE TABLE "excercise" 
("id"          UUID        DEFAULT gen_random_uuid(),
 "name"        D_UNTAINTED NOT NULL,
 "description" D_UNTAINTED NOT NULL,

 CONSTRAINT excercise_pk
    PRIMARY KEY ("id"),

 CONSTRAINT excercise_unique_name
    UNIQUE ("name")
);

CREATE TABLE "excercise_settings" 
("id"            UUID              DEFAULT gen_random_uuid(),
 "level_1"       INTEGER           DEFAULT 20,
 "level_2"       INTEGER           DEFAULT 50,
 "level_3"       INTEGER  NOT NULL DEFAULT 80,
 "excercise_id"  UUID     NOT NULL,
 "sort_signs_id" UUID     NOT NULL,

 CONSTRAINT excercise_settings_pk
    PRIMARY KEY ("id"),

 CONSTRAINT fk_excercise_id
    FOREIGN KEY ("excercise_id") REFERENCES excercise ("id")     ON DELETE CASCADE,

 CONSTRAINT fk_sort_signs_id
    FOREIGN KEY ("sort_signs_id") REFERENCES e_sort_signs ("id") ON DELETE CASCADE
);

CREATE TABLE "excercise_session" 
("id"               UUID                     DEFAULT gen_random_uuid(),
 "user_id"          UUID                     NOT NULL,
 "excercise_id"     UUID                     NOT NULL,
 "start_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
 "session_duration" INTERVAL,

 CONSTRAINT excercise_session_pk
    PRIMARY KEY ("id"),

 CONSTRAINT fk_user_id
    FOREIGN KEY ("user_id")      REFERENCES "user" ("id")      ON DELETE CASCADE,

 CONSTRAINT fk_excercise_id
    FOREIGN KEY ("excercise_id") REFERENCES "excercise" ("id") ON DELETE CASCADE
);

CREATE TABLE "task" 
("id"           UUID         DEFAULT gen_random_uuid(),
 "name"         D_UNTAINTED  NOT NULL,
 "description"  D_UNTAINTED,
 "excercise_id" UUID         NOT NULL,

 CONSTRAINT task_pk
    PRIMARY KEY ("id"),

 CONSTRAINT fk_excercise_id
    FOREIGN KEY ("excercise_id") REFERENCES excercise ("id") ON DELETE CASCADE,

 CONSTRAINT task_unique_name_and_excercise_id
    UNIQUE ("name", "excercise_id")
);

CREATE TABLE "sign" 
("id"                 UUID        DEFAULT gen_random_uuid(),
 "name"               D_UNTAINTED NOT NULL,
 "motion_category_id" UUID        NOT NULL,

 CONSTRAINT sign_pk
    PRIMARY KEY ("id"),

 CONSTRAINT fk_motion_category_id
    FOREIGN KEY ("motion_category_id") REFERENCES e_motion_category ("id") ON DELETE CASCADE,

 CONSTRAINT sign_unique_name
    UNIQUE ("name")
);

CREATE TABLE "sign_recording" 
("id"             UUID  DEFAULT gen_random_uuid(),
 "video"          BYTEA NOT NULL,
 "mimetype_id"    UUID  NOT NULL,
 "sign_id"        UUID  NOT NULL,
 "perspective_id" UUID,

 CONSTRAINT sign_recording_pk
    PRIMARY KEY ("id"),

 CONSTRAINT fk_mimetype_id
    FOREIGN KEY ("mimetype_id")    REFERENCES "e_mimetype" ("id")  ON DELETE CASCADE,

 CONSTRAINT fk_sign_id
    FOREIGN KEY ("sign_id")        REFERENCES "sign" ("id")        ON DELETE CASCADE,

 CONSTRAINT fk_perspective_id
    FOREIGN KEY ("perspective_id") REFERENCES "e_perspective" ("id") ON DELETE CASCADE
);


COMMIT;

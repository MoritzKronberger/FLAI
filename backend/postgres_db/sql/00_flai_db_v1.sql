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


COMMIT;

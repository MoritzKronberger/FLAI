BEGIN;

DROP TABLE IF EXISTS hello;

CREATE TABLE hello
("id"        UUID    DEFAULT gen_random_uuid(),
 "recipient" VARCHAR NOT NULL,

 CONSTRAINT hello_pk
    PRIMARY KEY ("id")
);

COMMIT;

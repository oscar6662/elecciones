DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id integer unique not null,
  user_name varchar(128),
  user_email varchar(128) not null,
  has_voted boolean not null DEFAULT false,
  admin boolean not null DEFAULT false,
  jwt varchar(10240) not null,
  access varchar(10240) not null,
  refresh varchar(10240) not null,
  date Date not null
);

DROP TABLE IF EXISTS candidates CASCADE;

CREATE TABLE IF NOT EXISTS candidates (
  id integer unique not null,
  user_name varchar(128) not null,
  user_email varchar(128) not null,
  img_url varchar(1024),
  description varchar(4096),
  votes integer not null DEFAULT 0
);

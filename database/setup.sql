DROP FUNCTION IF EXISTS update_token_expiration;
DROP EXTENSION IF EXISTS pgcrypto;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP TABLE IF EXISTS users;
DROP SEQUENCE IF EXISTS users_id_seq;

-- USERS TABLE
CREATE TABLE users (
  id serial NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  user_password varchar(255) NOT NULL,
  is_admin bool NOT NULL DEFAULT false,
  deleted_at timestamptz NULL,
  token varchar(255) NULL,
  date_expired timestamp(0) NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_name_unique UNIQUE (name),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Create a trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sets token expiration 1h after the token has been updated
CREATE OR REPLACE FUNCTION set_token_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update date_expired if the token is being changed
  IF NEW.token IS DISTINCT FROM OLD.token THEN
    NEW.date_expired = CURRENT_TIMESTAMP + INTERVAL '1 hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_token_expiration_trigger
BEFORE UPDATE OF token ON users
FOR EACH ROW
EXECUTE FUNCTION set_token_expiration();

-- Makes IDs sequential numbers
CREATE SEQUENCE users_id_seq;
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Security for passwords
CREATE EXTENSION IF NOT EXISTS pgcrypto;
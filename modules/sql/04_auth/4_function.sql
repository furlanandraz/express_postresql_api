CREATE OR REPLACE FUNCTION user_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $user_set_updated_at$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END $user_set_updated_at$;

CREATE OR REPLACE FUNCTION user_set_lowercase_email()
RETURNS TRIGGER
LANGUAGE plpgsql AS $user_set_lowercase_email$
BEGIN
  NEW.email := LOWER(NEW.email);
  RETURN NEW;
END $user_set_lowercase_email$;
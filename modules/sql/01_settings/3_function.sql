CREATE OR REPLACE FUNCTION enforce_default_language_rules()
RETURNS trigger
LANGUAGE plpgsql AS $enforce_default_language_rules$
BEGIN

    IF NEW.is_default AND NOT NEW.is_enabled THEN
        RAISE EXCEPTION 'Default language must be enabled';
    END IF;

    IF OLD.is_default AND OLD.is_enabled AND NOT NEW.is_enabled THEN
        RAISE EXCEPTION 'Cannot disable the default language';
    END IF;

    RETURN NEW;
END $enforce_default_language_rules$ ;
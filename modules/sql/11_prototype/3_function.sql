-- CREATE OR REPLACE FUNCTION prototype.update_template_schema ()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql AS $update_template_schema$
-- DECLARE
--     payload TEXT;
-- BEGIN
--     payload := json_build_object('id', NEW.id)::TEXT;
--     PERFORM pg_notify('update_template_schema', payload);
--     RETURN NEW;
-- END;
-- $update_template_schema$;

CREATE OR REPLACE FUNCTION prototype.create_default_base()
RETURNS TRIGGER 
LANGUAGE plpgsql AS $create_default_base$
BEGIN
    IF NEW.base IS NULL THEN
        NEW.base := json_build_object(
            'title', NEW.title,
            'type', 'object',
            'properties', json_build_object()
        );
    END IF;
    RETURN NEW;
END $create_default_base$;

CREATE OR REPLACE FUNCTION prototype.update_default_base()
RETURNS TRIGGER 
LANGUAGE plpgsql AS $update_default_base$
BEGIN
    IF NEW.base IS NOT NULL AND NEW.title IS DISTINCT FROM OLD.title THEN
        NEW.base := jsonb_set(NEW.base, '{title}', to_jsonb(NEW.title));
    END IF;
    RETURN NEW;
END $update_default_base$;
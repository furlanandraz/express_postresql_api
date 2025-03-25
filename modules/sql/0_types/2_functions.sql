CREATE OR REPLACE FUNCTION types.update_template_schema ()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_template_schema$
DECLARE
    payload TEXT;
BEGIN
    payload := json_build_object('id', NEW.id)::TEXT;
    PERFORM pg_notify('update_template_schema', payload);
    RETURN NEW;
END;
$update_template_schema$;
CREATE OR REPLACE FUNCTION types.update_segment_schema ()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_segment_schema$
DECLARE
    payload TEXT;
BEGIN
    payload := json_build_object('id', NEW.id)::TEXT;
    PERFORM pg_notify('update_segment_schema', payload);
    RETURN NEW;
END;
$update_segment_schema$;
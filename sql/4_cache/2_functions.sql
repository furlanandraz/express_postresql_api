CREATE OR REPLACE FUNCTION cache.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql AS $update_timestamp$
BEGIN
    NEW.cache_timestamp = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$update_timestamp$;
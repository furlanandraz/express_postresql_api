CREATE OR REPLACE FUNCTION language.validate_route_slug()
RETURNS TRIGGER
LANGUAGE plpgsql AS $validate_route_slug$
DECLARE
    is_index_route BOOLEAN;
BEGIN
    SELECT parent_id IS NULL
    INTO is_index_route
    FROM navigation.route
    WHERE id = NEW.route_id;

    IF is_index_route THEN
        
        NEW.slug := '';
        NEW.path := '';
        NEW.path := '';

    ELSE
        
        IF NEW.slug !~ '^[A-Za-z0-9_-]+$' THEN
            RAISE EXCEPTION 'Non-index routes must have a valid slug.';
        END IF;

    END IF;

    RETURN NEW;
END;
$validate_route_slug$;

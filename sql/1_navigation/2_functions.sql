CREATE OR REPLACE FUNCTION navigation.route_change()
RETURNS TRIGGER
LANGUAGE plpgsql AS $route_change$
DECLARE
BEGIN
	RAISE NOTICE 'MENU CHANGED';
    PERFORM pg_notify('route_change', '{"payload": "nothing"}');
    RETURN NULL;
END;
$route_change$;

-- "Anchor" url type removed until further development

-- CREATE OR REPLACE FUNCTION navigation.check_anchor_parent_static() 
-- RETURNS TRIGGER
-- LANGUAGE plpgsql AS $check_anchor_parent_static$
-- BEGIN
--     IF NEW.route_type = 'Anchor' AND (NEW.parent_id IS NOT NULL) THEN
--         IF (SELECT route_type FROM navigation.route WHERE id = NEW.parent_id) != 'static' THEN
--             RAISE EXCEPTION 'Parent route_type must be "static" for "Anchor" items';
--         END IF;
--     END IF;
--     RETURN NEW;
-- END;
-- $check_anchor_parent_static$;

CREATE OR REPLACE FUNCTION navigation.enforce_single_primary_url() 
RETURNS TRIGGER
LANGUAGE plpgsql AS $enforce_single_primary_url$
BEGIN
    IF NEW.primary_url = TRUE AND EXISTS (
        SELECT 1 FROM navigation.url 
        WHERE url_uuid = NEW.url_uuid 
        AND primary_url = TRUE
    ) THEN
        RAISE EXCEPTION 'Only one primary_url = TRUE is allowed per url_uuid';
    END IF;
    
    RETURN NEW;
END;
$enforce_single_primary_url$;

CREATE OR REPLACE FUNCTION navigation.prevent_deleting_primary_url() 
RETURNS TRIGGER
LANGUAGE plpgsql AS $prevent_deleting_primary_url$
BEGIN
    IF OLD.primary_url = TRUE THEN
        RAISE EXCEPTION 'Primary URLs cannot be deleted';
    END IF;
    
    RETURN OLD;
END;
$prevent_deleting_primary_url$;



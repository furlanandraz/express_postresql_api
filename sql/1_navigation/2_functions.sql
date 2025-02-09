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

CREATE OR REPLACE FUNCTION navigation.check_anchor_parent_static() 
RETURNS TRIGGER
LANGUAGE plpgsql AS $check_anchor_parent_static$
BEGIN
    IF NEW.route_type = 'Anchor' AND (NEW.parent_id IS NOT NULL) THEN
        IF (SELECT route_type FROM navigation.route WHERE id = NEW.parent_id) != 'Static' THEN
            RAISE EXCEPTION 'Parent route_type must be "Static" for "Anchor" items';
        END IF;
    END IF;
    RETURN NEW;
END;
$check_anchor_parent_static$;
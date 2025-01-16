CREATE OR REPLACE FUNCTION navigation.menu_item_change()
RETURNS TRIGGER
LANGUAGE plpgsql AS $menu_item_change$
DECLARE
BEGIN
	RAISE NOTICE 'MENU CHANGED';
    PERFORM pg_notify('menu_item_change', '{"payload": "nothing"}');
    RETURN NULL;
END;
$menu_item_change$;

CREATE OR REPLACE FUNCTION navigation.check_anchor_parent_static() 
RETURNS TRIGGER
LANGUAGE plpgsql AS $check_anchor_parent_static$
BEGIN
    IF NEW.url_type = 'anchor' AND (NEW.parent_id IS NOT NULL) THEN
        IF (SELECT url_type FROM navigation.menu_item WHERE id = NEW.parent_id) != 'static' THEN
            RAISE EXCEPTION 'Parent url_type must be "static" for anchor items';
        END IF;
    END IF;
    RETURN NEW;
END;
$check_anchor_parent_static$;
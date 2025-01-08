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

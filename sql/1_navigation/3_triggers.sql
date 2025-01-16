CREATE OR REPLACE TRIGGER menu_item_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON navigation.menu_item
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.menu_item_change();

CREATE TRIGGER check_anchor_parent_static_trigger
BEFORE INSERT OR UPDATE ON navigation.menu_item
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.check_anchor_parent_static();
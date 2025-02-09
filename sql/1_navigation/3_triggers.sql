CREATE OR REPLACE TRIGGER route_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON navigation.route
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.route_change();

CREATE TRIGGER check_anchor_parent_static_trigger
AFTER INSERT OR UPDATE OR DELETE ON navigation.route
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.check_anchor_parent_static();
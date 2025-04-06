CREATE OR REPLACE TRIGGER route_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON navigation.route
FOR EACH STATEMENT
EXECUTE PROCEDURE navigation.route_change();

-- CREATE TRIGGER check_anchor_parent_static_trigger
-- AFTER INSERT OR UPDATE OR DELETE ON navigation.route
-- FOR EACH STATEMENT
-- EXECUTE PROCEDURE navigation.check_anchor_parent_static();

-- CREATE OR REPLACE TRIGGER enforce_single_primary_url_trigger
-- BEFORE INSERT OR UPDATE ON navigation.url
-- FOR EACH ROW
-- EXECUTE FUNCTION navigation.enforce_single_primary_url();

-- CREATE OR REPLACE TRIGGER prevent_deleting_primary_url_trigger
-- BEFORE DELETE ON navigation.url
-- FOR EACH ROW
-- EXECUTE FUNCTION navigation.prevent_deleting_primary_url();

-- DROP TRIGGER IF EXISTS enforce_single_primary_url_trigger ON navigation.url;
-- DROP FUNCTION IF EXISTS navigation.enforce_single_primary_url;

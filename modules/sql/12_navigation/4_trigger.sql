CREATE TRIGGER check_parent_render_type
BEFORE INSERT OR UPDATE ON navigation.route
FOR EACH ROW
EXECUTE FUNCTION navigation.prevent_topic_as_parent();

CREATE OR REPLACE TRIGGER prevent_duplicate_sibling_slug
BEFORE UPDATE OF parent_id ON navigation.route
FOR EACH ROW
EXECUTE FUNCTION navigation.prevent_duplicate_sibling_slug();
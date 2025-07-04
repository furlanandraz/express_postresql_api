CREATE TRIGGER check_parent_render_type
BEFORE INSERT OR UPDATE ON navigation.route
FOR EACH ROW
EXECUTE FUNCTION navigation.prevent_topic_as_parent();
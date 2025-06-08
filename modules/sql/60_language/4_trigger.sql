CREATE TRIGGER validate_route_slug
BEFORE INSERT OR UPDATE ON language.route_translation
FOR EACH ROW
EXECUTE FUNCTION language.validate_route_slug();
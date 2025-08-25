CREATE TRIGGER validate_route_slug
BEFORE INSERT OR UPDATE ON language.route_translation
FOR EACH ROW
EXECUTE FUNCTION language.validate_route_slug();

CREATE OR REPLACE TRIGGER enforce_unique_sibling_slug
BEFORE INSERT OR UPDATE OF slug ON language.route_translation
FOR EACH ROW
EXECUTE FUNCTION language.enforce_unique_sibling_slug();
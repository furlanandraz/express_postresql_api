CREATE OR REPLACE TRIGGER enforce_default_language_rules
BEFORE INSERT ON settings.language
FOR EACH ROW
EXECUTE FUNCTION enforce_default_language_rules();
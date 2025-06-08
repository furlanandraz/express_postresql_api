CREATE TRIGGER user_set_lowercase_email
BEFORE INSERT OR UPDATE ON auth.user
FOR EACH ROW
EXECUTE FUNCTION user_set_lowercase_email();

CREATE TRIGGER user_set_updated_at
BEFORE UPDATE ON auth.user
FOR EACH ROW
EXECUTE FUNCTION user_set_updated_at();
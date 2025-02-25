CREATE OR REPLACE TRIGGER set_json_form
AFTER INSERT OR UPDATE ON types.template_schema
FOR EACH ROW
EXECUTE FUNCTION types.update_template_schema();
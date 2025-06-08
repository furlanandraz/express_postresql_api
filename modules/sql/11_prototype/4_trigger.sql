-- CREATE OR REPLACE TRIGGER set_json_form
-- AFTER INSERT OR UPDATE ON prototype.template_schema
-- FOR EACH ROW
-- EXECUTE FUNCTION prototype.update_template_schema();

CREATE OR REPLACE TRIGGER create_default_base
BEFORE INSERT ON prototype.component_type
FOR EACH ROW
EXECUTE FUNCTION prototype.create_default_base();

CREATE OR REPLACE TRIGGER create_default_base
BEFORE INSERT ON prototype.template_type
FOR EACH ROW
EXECUTE FUNCTION prototype.create_default_base();

CREATE OR REPLACE TRIGGER create_default_base
BEFORE INSERT ON prototype.layout_type
FOR EACH ROW
EXECUTE FUNCTION prototype.create_default_base();

CREATE OR REPLACE TRIGGER update_default_base
BEFORE UPDATE ON prototype.component_type
FOR EACH ROW
EXECUTE FUNCTION prototype.update_default_base();

CREATE OR REPLACE TRIGGER update_default_base
BEFORE UPDATE ON prototype.template_type
FOR EACH ROW
EXECUTE FUNCTION prototype.update_default_base();

CREATE OR REPLACE TRIGGER update_default_base
BEFORE UPDATE ON prototype.layout_type
FOR EACH ROW
EXECUTE FUNCTION prototype.update_default_base();
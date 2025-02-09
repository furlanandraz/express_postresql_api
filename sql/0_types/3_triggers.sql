CREATE OR REPLACE TRIGGER set_json_form
AFTER INSERT OR UPDATE ON types.segment_schema
FOR EACH ROW
EXECUTE FUNCTION types.update_segment_schema();
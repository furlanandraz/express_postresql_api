CREATE OR REPLACE TRIGGER set_updated_at
BEFORE UPDATE ON cache.navigation_cache
FOR EACH ROW
EXECUTE PROCEDURE cache.update_timestamp();
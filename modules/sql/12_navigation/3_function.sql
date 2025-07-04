CREATE OR REPLACE FUNCTION navigation.prevent_topic_as_parent()
RETURNS TRIGGER 
LANGUAGE plpgsql AS $prevent_topic_as_parent$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
  
    IF EXISTS (
      SELECT 1
      FROM navigation.route AS r
      WHERE r.id = NEW.parent_id AND r.render_type = 'topic'
    ) THEN
      RAISE EXCEPTION 'A route with render_type = ''topic'' cannot be used as a parent.';
    END IF;
  END IF;

  RETURN NEW;
END;
$prevent_topic_as_parent$;


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

CREATE OR REPLACE FUNCTION navigation.prevent_duplicate_sibling_slug()
RETURNS trigger
LANGUAGE plpgsql AS $prevent_duplicate_sibling_slug$
BEGIN

  IF NEW.parent_id = OLD.parent_id THEN
    RETURN NEW;
  END IF;
  
  IF EXISTS (
    SELECT 1
    FROM language.route_translation t
    JOIN navigation.route r ON r.id = t.route_id
    WHERE r.parent_id = NEW.parent_id
      AND t.route_id <> NEW.id
      AND (t.language_code, lower(t.slug)) IN (
            SELECT language_code, lower(slug)
            FROM language.route_translation
            WHERE route_id = NEW.id
          )
  ) THEN

    RAISE EXCEPTION
      'Duplicate slug among siblings after move (parent_id=%s)',
      NEW.parent_id;
            
  END IF;

  RETURN NEW;
END $prevent_duplicate_sibling_slug$;




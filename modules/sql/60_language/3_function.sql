CREATE OR REPLACE FUNCTION language.validate_route_slug()
RETURNS TRIGGER
LANGUAGE plpgsql AS $validate_route_slug$
DECLARE
    is_index_route BOOLEAN;
BEGIN
    SELECT parent_id IS NULL
    INTO is_index_route
    FROM navigation.route
    WHERE id = NEW.route_id;

    IF is_index_route THEN
        
        NEW.slug := '';
        NEW.path := '';
        NEW.path := '';

    ELSE

        NEW.slug := lower(NEW.slug);
        
        IF NEW.slug !~ '^[A-Za-z0-9_-]+$' THEN
            RAISE EXCEPTION 'Non-index routes must have a valid slug.';
        END IF;

    END IF;

    RETURN NEW;

END $validate_route_slug$;

CREATE OR REPLACE FUNCTION language.enforce_unique_sibling_slug()
RETURNS trigger
LANGUAGE plpgsql AS $enforce_unique_sibling_slug$
DECLARE
  v_parent_id int;
BEGIN
  
  SELECT r.parent_id INTO v_parent_id
  FROM navigation.route r
  WHERE r.id = NEW.route_id;

  IF EXISTS (
    SELECT 1
    FROM language.route_translation t
    JOIN navigation.route r ON r.id = t.route_id
    WHERE r.parent_id = v_parent_id
        AND t.language_code = NEW.language_code
        AND lower(t.slug) = lower(NEW.slug)
  ) THEN

    RAISE EXCEPTION
      'Duplicate slug among siblings (parent_id=%, lang=%, slug=%)',
      v_parent_id, NEW.language_code, lower(NEW.slug);
      
  END IF;

  RETURN NEW;
END $enforce_unique_sibling_slug$;



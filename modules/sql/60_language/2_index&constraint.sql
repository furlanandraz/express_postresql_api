ALTER TABLE language.global_translation
ADD CONSTRAINT chk_value_is_valid
CHECK (
    key ~ '^[A-Za-z0-9_-]+$'
);
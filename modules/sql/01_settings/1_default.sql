INSERT INTO settings.language (
    code
) VALUES 
('en'),
('sl'),
('de'),
('it');

UPDATE settings.language
SET is_enabled = (code = 'en' OR code = 'sl');

UPDATE settings.language
SET is_default = (code = 'en');

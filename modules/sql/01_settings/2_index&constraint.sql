CREATE UNIQUE INDEX idx_language_unique_default
ON settings.language (is_default)
WHERE is_default = TRUE;
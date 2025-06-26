CREATE VIEW
    public.route_item
AS SELECT
    r.*,
	l.code AS language_code,
    COALESCE(t.slug, '') AS slug,
    COALESCE(t.title, '') AS title,
    COALESCE(t.label, '') AS label,
    COALESCE(t.meta_description, '') AS meta_description,
    COALESCE(t.meta_keywords, '') AS meta_keywords,
    COALESCE(t.path, NULL) AS path,
    COALESCE(t.breadcrumbs, NULL) AS breadcrumbs
FROM
    navigation.route r
CROSS JOIN
    settings.language l
LEFT JOIN
    language.route_translation t
ON
    r.id = t.route_id AND l.code = t.language_code
WHERE l.is_enabled = TRUE;


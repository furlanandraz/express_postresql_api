CREATE OR REPLACE VIEW
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


CREATE OR REPLACE VIEW
    public.route_item_simple
AS SELECT 
    r.*,
    t.label
FROM
    navigation.route r
CROSS JOIN
    settings.language l
LEFT JOIN
    language.route_translation t
ON
    r.id = t.route_id
AND
    l.code = t.language_code
WHERE
    l.is_default = TRUE;

CREATE OR REPLACE VIEW
    public.route_layout_preset
AS SELECT
    r.id AS route_id,
    rlc.layout_type_id
FROM
    navigation.route r
LEFT JOIN
    presentation.route_layout_class rlc
ON
    r.id = rlc.route_id;

CREATE OR REPLACE VIEW
    public.route_layout_properties
AS SELECT
    r.id AS route_id,
	l.code AS language_code,
    COALESCE(rlit.data, '{}'::json) AS properties,
    pt.id AS layout_type_id
FROM
    navigation.route r
CROSS JOIN
    settings.language l
LEFT JOIN
    presentation.route_layout_class rlc
ON
    r.id = rlc.route_id
LEFT JOIN
    language.route_layout_instance_translation rlit
ON
    r.id = rlit.route_id AND l.code = rlit.language_code
LEFT JOIN
    prototype.layout_type pt
ON    
    rlc.layout_type_id = pt.id;




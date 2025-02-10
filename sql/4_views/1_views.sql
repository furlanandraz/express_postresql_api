CREATE VIEW navigation.route_layout_page AS
SELECT
    r.id,
    r.parent_id,
    r.url_name,
    r.ui_name,
    r.meta_description,
    r.meta_keywords,
    r.url_type,
    r.render_method,
    COALESCE(rl.layout_id, NULL) AS layout_id,
    COALESCE(rp.id, NULL) AS page_id
FROM
    navigation.route r
LEFT JOIN
    presentation.route_layout_type rl
ON
    r.id = rl.route_id
LEFT JOIN
    presentation.route_page_content rp
ON
    r.id = rp.route_id;
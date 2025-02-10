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

CREATE VIEW presentation.route_page_segment_type AS
SELECT
    rpc.route_id,
    rpc.segment_instance_order,
    si.segment_json,
    tt.url_name
FROM presentation.route_page_content rpc
LEFT JOIN presentation.segment_instance si 
    ON rpc.segment_instance_id = si.id
LEFT JOIN types.segment_schema ss 
    ON si.segment_id = ss.id
LEFT JOIN types.template_type tt 
    ON ss.template_schema_id = tt.id
ORDER BY rpc.segment_instance_order ASC;

CREATE VIEW presentation.route_layout_type_url AS
SELECT
    rl.route_id,
	lt.url_name
FROM presentation.route_layout_type rl
LEFT JOIN types.layout_type lt 
    ON rl.layout_id = lt.id;
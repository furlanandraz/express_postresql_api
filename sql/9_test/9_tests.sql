INSERT INTO navigation.route (
    id,
    parent_id,
    url_name,
    ui_name,
    meta_description,
    meta_keywords
) VALUES (
    2,
    1,
    'contact',
    'contact',
    'Ask me anything about my CMS',
    'CMS, FAQ'
), (
    3,
    1,
    'about',
    'About',
    'Ask me anything about my CMS',
    'CMS, FAQ'
), (
    4,
    1,
    'services',
    'Services',
    'Other services',
    ''
), (
    5,
    4,
    'plumbing',
    'Plumbing',
    '',
    ''
), (
    6,
    4,
    'wiring',
    'Wiring',
    '',
    ''
);

-- manually created segment schema, subsequent creations to be handled in react app
--- can be ran only after lib is parsed to tables
--- replace ids with current ids in tables

-- INSERT INTO types.segment_schema (
--     template_schema_id,
--     json_preset
-- ) VALUES (
--     1,
--     '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":2},"paragraph":{"component_id":5}}}}}'
-- );
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

--- can be ran only after lib is parsed to tables

-- INSERT INTO types.segment_schema (
--     id,
--     template_schema_id,
--     json_preset
-- ) VALUES (
--     1,
--     1,
--     '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":5},"figure":{"component_id":2},"paragraph":{"component_id":4}}}}}'
-- );

-- INSERT INTO presentation.segment_instance (
--     id,
--     segment_id,
--     segment_json
-- ) VALUES (
--     1,
--     1,
--     '{"template":{"align":"left","background":true},"components":{"buttonLinkPrimary":{"variant":"primary","text":"Hello","href":"www.google.com"},"buttonLinkSecondary":{"variant":"secondary","text":"Bye","href":"www.facebook.com"},"title":{"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."},"figure":{"figcaption":"photo"},"paragraph":{"largeTitle":"Large Title","smallTitle":"Small Title"}}}'
-- );

-- INSERT INTO presentation.route_page_content (
--     id,
--     route_id,
--     segment_id,
--     segment_order
-- ) VALUES (
--     1,
--     1,
--     1,
--     1
-- );


-- INSERT INTO presentation.route_layout_type (
--     id,
--     route_id,
--     layout_id
-- ) VALUES (
--     1,
--     1,
--     1
-- );

-- INSERT INTO navigation.route (
--     id,
--     parent_id
-- ) VALUES (
--     2,
--     3
-- ), (
--     3,
--     1'
-- ), (
--     4,
--     1
-- );

------ npm run init:types

-- INSERT INTO types.template_schema (
--     id,
--     template_type_id,
--     json_preset
-- ) VALUES (
--     1,
--     1,
--     '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":2},"paragraph":{"component_id":5}}}}}'
-- );

-- INSERT INTO types.template_schema (
--     id,
--     template_type_id,
--     json_preset
-- ) VALUES (
--     1,
--     1,
--     '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":2},"paragraph":{"component_id":5}}}}}'
-- );

-- INSERT INTO types.layout_schema (
--     id,
--     layout_type_id,
--     json_preset
-- ) VALUES (
--     1,
--     1,
--     '{"type":"object","properties":{"layout":{"layout_id":1},"templates":{"type":"object","title":"Templates","properties":{"textPhoto":{"template_id":1}}},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1}}}}}'
-- ), (
--     2,
--     2,
--     '{"type":"object","properties":{"layout":{"layout_id":2},"templates":{},"components":{}}}'
-- );

------ npm run render via api endpoints for each entry above using id

-- INSERT INTO presentation.route_template_instance (
-- 	route_id,
-- 	template_type_id,
-- 	template_instance_order,
--     json_data
-- ) VALUES (
--     1,
--     1,
-- 	   1,
--     '{"template":{"align":"left","background":true},"components":{"buttonLinkPrimary":{"variant":"primary","text":"Hello","href":"www.google.com"},"buttonLinkSecondary":{"variant":"secondary","text":"Bye","href":"www.facebook.com"},"title":{"largeTitle":"Large Title","smallTitle":"Small title"},"figure":{"figcaption":"Figure Caption helo from rjsf"},"paragraph":{"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}}}'
-- );

-- add Main layout to index page

-- INSERT INTO presentation.route_layout_instance (
--     id,
--     route_id,
--     layout_type_id,
--     json_data
-- ) VALUES (
--     1,
--     1,
--     1,
--     '{"layout":{"phone":"123123123","socials":[{"url":"www.facebook.com","platform":"facebook"}]},"templates":{"textPhoto":{"template":{"align":"left","background":false},"components":{"title":{"description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"},"paragraph":{"largeTitle":"Large Title","smallTitle":"Small title"},"buttonLinkPrimary":{"variant":"primary"},"buttonLinkSecondary":{"variant":"primary"}}}},"components":{"buttonLinkPrimary":{"href":"www.google.com","text":"Button Link - Component","variant":"primary"}}}'
-- );

-- -- add topic for dynamic routes
-- INSERT INTO presentation.topic_layout (
--     id,
--     route_id,
--     layout_schema_id
-- ) VALUES (
--     1,
--     4,
--     2
-- );

-- INSERT INTO presentation.topic_instance (
--     id,
--     topic_layout_id,
--     slug,
--     json_data
-- ) VALUES (
--     1,
--     1,
--     'plumbing',
--     '{"layout":{"serviceName":"Plumbing - from props"}}'
-- ), (
--     2,
--     1,
--     'wiring',
--     '{"layout":{"serviceName":"Wiring - from props"}}'
-- );



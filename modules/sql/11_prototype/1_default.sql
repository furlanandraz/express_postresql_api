INSERT INTO prototype.component_type (
    slug,
    title,
    base
) VALUES (
    'ButtonLink',
    'Button Link',
    '{"title":"Button Link","type":"object","properties":{"variant":{"type":"string","enum":["primary","secondary"],"default":"primary","title":"Button Variant"},"text":{"type":"string","title":"Button Text"},"href":{"type":"string","title":"Button URL"}}}'
), (
    'Paragraph',
    'Paragraph',
    '{"title":"Paragraph","type":"object","properties":{"description":{"type":"string","title":"Paragraph","ui:widget":"textarea"}}}'
), (
    'Title',
    'Title',
    '{"title":"Title","type":"object","properties":{"largeTitle":{"type":"string","title":"Large Title"},"smallTitle":{"type":"string","title":"Small title"}}}'
);

INSERT INTO prototype.template_type (
    slug,
    title,
    base
) VALUES (
    'TextPhoto',
    'Text Photo',
    '{"title":"Text Photo","type":"object","properties":{"align":{"type":"string","enum":["left","right"],"default":"left","title":"Align Content"},"background":{"type":"boolean","default":false,"title":"Show Background"}}}'
);

INSERT INTO prototype.layout_type (
    slug,
    title,
    base
) VALUES (
    'Main',
    'Main',
    '{"title":"Main","type":"object","properties":{"socials":{"title":"Socials","type":"array","items":{"type":"object","properties":{"platform":{"type":"string","enum":["instagram","facebook","youtube"],"default":"instagram"},"url":{"type":"string"}},"required":["platform","url"]},"description":"Social Media Profiles"},"phone":{"title":"Business Phone Number","type":"string"}}}'
), (
    'Service',
    'Service',
    '{"title":"Service","type":"object","properties":{"serviceName":{"title":"Service Name","type":"string","description":"Service Name"}}}'
), (
    'ServiceGrid',
    'Service Grid',
    '{"title":"ServiceGrid","type":"object","properties":{}}'
);

INSERT INTO prototype.template_schema (
    template_type_id,
    reference
) VALUES (
    1,
    '{"type":"object","properties":{"template":{"template_id":1},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1},"buttonLinkSecondary":{"component_id":1},"title":{"component_id":4},"figure":{"component_id":2},"paragraph":{"component_id":5}}}}}'
);

INSERT INTO prototype.layout_schema (
    layout_type_id,
    reference
) VALUES (
    1,
    '{"type":"object","properties":{"layout":{"layout_id":1},"templates":{"type":"object","title":"Templates","properties":{"textPhoto":{"template_id":1}}},"components":{"type":"object","title":"Components","properties":{"buttonLinkPrimary":{"component_id":1}}}}}'
), (
    2,
    '{"type":"object","properties":{"layout":{"layout_id":2},"templates":{},"components":{}}}'
), (
    3,
    '{"type":"object","properties":{"layout":{"layout_id":3},"templates":{},"components":{}}}'
);


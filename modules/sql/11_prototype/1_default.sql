INSERT INTO prototype.component_type (
    slug,
    title,
    base
) VALUES (
    'Button Link',
    'ButtonLink.svelte',
    '{"title":"Button Link","type":"object","properties":{"variant":{"type":"string","enum":["primary","secondary"],"default":"primary","title":"Button Variant"},"text":{"type":"string","title":"Button Text"},"href":{"type":"string","title":"Button URL"}}}'
), (
    'Figure',
    'Figure.svelte',
    '{"title":"Figure","type":"object","properties":{"figcaption":{"type":"string","title":"Figure Caption"},"src":{"type":"string","title":"Image Source URL","format":"data-url","mimetypes":["image/jpeg","image/webp"],"ui:options":{"accept":"image/jpeg, image/webp"}}}}'
), (
    'Paragraph',
    'Paragraph.svelte',
    '{"title":"Paragraph","type":"object","properties":{"description":{"type":"string","title":"Paragraph","ui:widget":"textarea"}}}'
), (
    'Title',
    'Title.svelte',
    '{"title":"Title","type":"object","properties":{"largeTitle":{"type":"string","title":"Large Title"},"smallTitle":{"type":"string","title":"Small title"}}}'
);

INSERT INTO prototype.component_type (
    slug,
    title,
    base
) VALUES (
    'Text Photo',
    'TextPhoto.svelte',
    '{"title":"Text Photo","type":"object","properties":{"align":{"type":"string","enum":["left","right"],"default":"left","title":"Align Content"},"background":{"type":"boolean","default":false,"title":"Show Background"}}}'
);

INSERT INTO prototype.layout_type (
    slug,
    title,
    base
) VALUES (
    'Main Layout',
    'MainLayout.svelte',
    '{"title":"Main Layout","type":"object","properties":{"socials":{"title":"Socials","type":"array","items":{"type":"object","properties":{"platform":{"type":"string","enum":["instagram","facebook","youtube"],"default":"instagram"},"url":{"type":"string"}},"required":["platform","url"]},"description":"Social Media Profiles"},"phone":{"title":"Business Phone Number","type":"string"}}}'
), (
    'Service Layout',
    'ServiceLayout.svelte',
    '{"title":"Service Layout","type":"object","properties":{"serviceName":{"title":"Service Name","type":"string","description":"Service Name"}}}'
);


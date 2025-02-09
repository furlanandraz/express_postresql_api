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
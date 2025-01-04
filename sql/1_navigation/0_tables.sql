CREATE TABLE navigation.menu_item (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.menu_item(id) ON DELETE CASCADE,
    url_name TEXT NOT NULL DEFAULT '',
    ui_name TEXT NOT NULL DEFAULT '',
    meta_description TEXT,
    meta_keywords TEXT
);

INSERT INTO navigation.menu_item (
    parent_id,
    url_name,
    ui_name,
    meta_description,
    meta_keywords
) VALUES (
    NULL,
    '',
    'Home',
    'Homepage for my CMS',
    'CMS, website, home'
);
CREATE TABLE navigation.menu_item (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES navigation.menu_item(id) ON DELETE CASCADE,
    url_name TEXT NOT NULL DEFAULT '',
    url_type types.url_type DEFAULT 'static',
    ui_name TEXT NOT NULL DEFAULT '',
    meta_description TEXT,
    meta_keywords TEXT,
    render_method types.render_method DEFAULT 'ssr',
    layout_type TEXT DEFAULT ''
);

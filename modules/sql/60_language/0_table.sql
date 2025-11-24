CREATE TABLE language.global_translation (
    key VARCHAR(64) NOT NULL,
    language_code VARCHAR(2) NOT NULL REFERENCES settings.language(code) ON DELETE CASCADE,
    value TEXT NOT NULL,

    PRIMARY KEY (key, language_code)
);

CREATE TABLE language.route_translation (
    route_id INT NOT NULL REFERENCES navigation.route(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL REFERENCES settings.language(code) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    label TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    meta_keywords TEXT NOT NULL DEFAULT '',
    path TEXT,
    breadcrumbs JSON,

    PRIMARY KEY (route_id, language_code),
    UNIQUE (language_code, path)
);

CREATE TABLE language.route_layout_instance_translation (
    route_id INT NOT NULL REFERENCES navigation.route(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL REFERENCES settings.language(code) ON DELETE CASCADE,
    data JSON NOT NULL DEFAULT '{}',

    PRIMARY KEY (route_id, language_code)
);

CREATE TABLE language.route_template_instance_translation (
    route_template_class_id INT NOT NULL REFERENCES presentation.route_template_class(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL REFERENCES settings.language(code) ON DELETE CASCADE,
    data JSON NOT NULL DEFAULT '{}',

    PRIMARY KEY (route_template_class_id, language_code)
);


CREATE TABLE language.route_topic_instance_translation (
    route_topic_class_id INT NOT NULL REFERENCES presentation.route_topic_class(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL REFERENCES settings.language(code) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    label TEXT,
    title VARCHAR(64) NOT NULL,
    meta_description TEXT NOT NULL DEFAULT '',
    meta_keywords TEXT NOT NULL DEFAULT '',
    path TEXT NOT NULL,
    breadcrumbs JSON NOT NULL,
    data JSON NOT NULL DEFAULT '{}',
    
    PRIMARY KEY (route_topic_class_id, language_code),
    UNIQUE(language_code, path)
);
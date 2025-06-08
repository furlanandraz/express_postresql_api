INSERT INTO auth.role (
    id,
    name,
    permission_view,
    permission_edit
)  VALUES (
    1,
    'admin',
    '["settings", "language", "auth", "prototype", "navigation", "presentation", "media"]',
    '["settings", "language", "auth", "prototype", "navigation", "presentation", "media"]'
), (
    2,
    'editor',
    '["prototype", "navigation", "presentation", "media"]',
    '["prototype", "navigation", "presentation", "media"]'
), (
    3,
    'viewer',
    '["navigation", "presentation", "media"]',
    '[]'
);

INSERT INTO auth.user (
    email,
    password,
    role
) VALUES (
    'admin@furlanandraz.com',
    '$2b$12$ZuKnKs7HWQPFdWlGr8VW3OV12tZhsWY2qXyg0LRHH353zDa5.qF.K', -- pass: admin
    1
), (
    'editor@furlanandraz.com',
    '$2b$12$S1WM.Oi5fXfs2oR8.Avc9uiwRGOzNhi3JPlUCT1s4C9Q51H3CR19W', -- pass: editor
    1
), (
    'viewer@furlanandraz.com',
    '$2b$12$/JDar.z8Y4A/.2XVPI4dXezW9Ibs/QSAiqHnSdfMX3OfSIUnB3Miy', -- pass: viewer
    1
);
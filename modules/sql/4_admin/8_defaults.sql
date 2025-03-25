INSERT INTO admin.role (
    id,
    name
)  VALUES (
    1,
    'god'
), (
    2,
    'admin'
), (
    3,
    'viewer'
);

INSERT INTO admin.user (
    email,
    password,
    role
) VALUES (
    'test@furlanandraz.com',
    '$2b$12$ZuKnKs7HWQPFdWlGr8VW3OV12tZhsWY2qXyg0LRHH353zDa5.qF.K',
    1
);
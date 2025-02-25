-- CREATE TYPE types.route_type AS ENUM ('static', 'dynamic', 'Anchor');
CREATE TYPE types.route_url_type AS ENUM ('static', 'dynamic');
CREATE TYPE types.route_render_method AS ENUM ('SSR', 'SSG', 'CSR');
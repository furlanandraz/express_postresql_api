-- CREATE TYPE types.route_type AS ENUM ('static', 'dynamic', 'Anchor');
CREATE TYPE route_render_type AS ENUM ('page', 'topic');
CREATE TYPE route_render_method AS ENUM ('SSR', 'SSG', 'CSR');
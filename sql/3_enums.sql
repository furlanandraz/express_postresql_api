-- CREATE TYPE types.route_type AS ENUM ('Static', 'Dynamic', 'Anchor');
CREATE TYPE types.route_url_type AS ENUM ('Static', 'Dynamic');
CREATE TYPE types.route_render_method AS ENUM ('SSR', 'SSG', 'CSR');
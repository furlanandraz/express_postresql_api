-- CREATE TYPE types.route_type AS ENUM ('Static', 'Dynamic', 'Anchor');
CREATE TYPE types.route_type AS ENUM ('Static', 'Dynamic');
CREATE TYPE types.render_method AS ENUM ('SSR', 'SSG', 'CSR');
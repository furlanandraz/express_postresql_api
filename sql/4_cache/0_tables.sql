CREATE TABLE cache.navigation_cache (
    id SERIAL PRIMARY KEY,
    cache_name TEXT UNIQUE NOT NULL,
    cache_json JSON NOT NULL,
    cache_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT 
    n.nspname AS schema_name,
    c.relname AS table_name,
    t.tgname AS trigger_name,
    p.proname AS function_name
FROM 
    pg_trigger t
JOIN 
    pg_class c ON t.tgrelid = c.oid
JOIN 
    pg_namespace n ON c.relnamespace = n.oid
JOIN 
    pg_proc p ON t.tgfoid = p.oid
WHERE 
    NOT t.tgisinternal
ORDER BY 
    schema_name, table_name, trigger_name;
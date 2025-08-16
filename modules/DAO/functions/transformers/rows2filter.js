import fs from 'fs';
import path from 'path';

export default function rows2filter({ filters, table }) {
  const result = {};
  const params = [];
  let conditions = [];

  // Load schema to get types for casting
  const schemaPath = path.join(
    process.cwd(),
    'modules', 'validation', 'database', `${table}.json`
  );
  const raw = fs.readFileSync(schemaPath, 'utf-8');
  const schema = JSON.parse(raw);
  const props = schema.properties;

  let paramIndex = 1;

  for (const [key, rawValue] of Object.entries(filters)) {
    if (!(key in props)) continue;

    const type = props[key]?.type || 'string';
    const types = Array.isArray(type) ? type : [type];

    // Determine SQL casting type
    let pgType = 'text';
    if (types.includes('integer')) pgType = 'int';
    else if (types.includes('object') || types.includes('array')) pgType = 'jsonb';

    // Handle OR: "5,7"
    if (rawValue.includes(',')) {
      const values = rawValue.split(',').map(v => v.trim());
      const clause = values.map(() => `${key} = $${paramIndex++}::${pgType}`).join(' OR ');
      params.push(...values.map(v => castValue(v, pgType)));
      conditions.push(`(${clause})`);
      continue;
    }

    // Handle IN: "5|7"
    if (rawValue.includes('|')) {
      const values = rawValue.split('|').map(v => v.trim());
      const placeholders = values.map(() => `$${paramIndex++}::${pgType}`);
      params.push(...values.map(v => castValue(v, pgType)));
      conditions.push(`${key} IN (${placeholders.join(', ')})`);
      continue;
    }

    // Default: equality or ILIKE for strings
    const casted = castValue(rawValue, pgType);
    params.push(casted);
    const operator = pgType === 'text' ? 'ILIKE' : '=';
    conditions.push(`${key} ${operator} $${paramIndex++}::${pgType}`);
  }

  result.conditions = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
    result.params = params;
    
  return result;
}

function castValue(val, pgType) {
  if (pgType === 'int') return parseInt(val, 10);
  if (pgType === 'jsonb') return JSON.parse(val);
  return val;
}

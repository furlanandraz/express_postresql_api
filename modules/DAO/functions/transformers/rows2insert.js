import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  removeAdditional: 'all',
  useDefaults: true
});

ajv.addKeyword('custom_type');

export default function rows2insert(rows, table) {
  const result = {};

  if (!Array.isArray(rows)) {
    return { error: 'Input must be an array of objects.' };
  }

  const schemaPath = path.join(
    process.cwd(),
    'modules', 'validation', 'database', `${table}.json`
  );
  const raw = fs.readFileSync(schemaPath, 'utf-8');
  const schema = JSON.parse(raw);

  const validate = ajv.compile(schema);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const valid = validate(row);

    if (!valid) {
      result.error = 'Validation error';
      result.index = i;
      result.issues = validate.errors.map(err => {
        const field = err.instancePath.replace(/^\//, '');
        const message = err.message || 'Invalid value';
        const issue = { field, message };
        if (err.keyword === 'enum' && err.params?.allowedValues) {
          issue.allowed = err.params.allowedValues;
        }
        return issue;
      });
      return result; // Exit early on first error
    }
  }

  const props = schema.properties;
  const cols = Object.keys(rows[0]).filter(key => key !== 'id');
  result.columns = `(${cols.join(', ')})`;

  result.values = rows
    .map(row => {
      const casted = cols.map(key => {
        const value = row[key];
        const prop = props[key];

        if (value === null) return 'NULL';

        // Determine pgType
        let pgType = prop?.custom_type;
        if (!pgType) {
          const types = Array.isArray(prop?.type) ? prop.type : [prop?.type];
          if (types.includes('integer')) pgType = 'int';
          else if (types.includes('string')) pgType = 'text';
          else if (types.includes('object') || types.includes('array')) pgType = 'json';
          else pgType = 'text'; // fallback
        }

        // Escape value
        let safeVal;
        if (typeof value === 'string') {
          safeVal = `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value === 'object') {
          safeVal = `'${JSON.stringify(value)}'`;
        } else {
          safeVal = value;
        }

        return `${safeVal}::${pgType}`;
      });

      return `(${casted.join(', ')})`;
    })
    .join(', ');

  return result;
}

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

export default function rows2update(data, table) {
  const result = {};

  if (typeof data !== 'object' || Array.isArray(data)) {
    return { error: 'Input must be a single object.' };
  }

  const schemaPath = path.join(
    process.cwd(),
    'modules', 'validation', 'database', `${table}.json`
  );

  const raw = fs.readFileSync(schemaPath, 'utf-8');
  const schema = JSON.parse(raw);

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    result.error = 'Validation error';
    result.issues = validate.errors.map(err => {
      const field = err.instancePath.replace(/^\//, '');
      const message = err.message || 'Invalid value';
      const issue = { field, message };
      if (err.keyword === 'enum' && err.params?.allowedValues) {
        issue.allowed = err.params.allowedValues;
      }
      return issue;
    });
    return result;
  }

  const props = schema.properties;
  const keys = Object.keys(data).filter(key => key !== 'id');

  const assignments = keys.map((key, index) => {
    const prop = props[key];
    const cast = prop?.custom_type
      ? `::${prop.custom_type}`
      : inferPgType(prop?.type);

    return `${key} = $${index + 1}${cast}`;
  });

  result.set = assignments.join(', ');
  result.params = keys.map(key => data[key]);

  return result;
}

function inferPgType(type) {
  const types = Array.isArray(type) ? type : [type];
  if (types.includes('integer')) return '::int';
  if (types.includes('string')) return '::text';
  if (types.includes('object') || types.includes('array')) return '::json';
  return '::text'; // fallback
}

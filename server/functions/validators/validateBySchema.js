import fs from 'fs';
import path from 'path';
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, strict: false });

const schemaPath = path.join(
    process.cwd(),
    'modules/validation/postgres/json-schema.json'
);
const raw = fs.readFileSync(schemaPath, 'utf-8');
const schema = JSON.parse(raw);
  
export function validateBySchema(tableName, data) {
    const def = schema.definitions?.[tableName];
    if (!def) {
      throw new Error(`No schema definition found for table "${tableName}"`);
    }
  
    const wrapper = {
      $schema:    schema.$schema,
      definitions: schema.definitions,
      $ref:       `#/definitions/${tableName}`
    };
  
    const validate = ajv.compile(wrapper);
    const valid    = validate(data);
    if (valid) return null;
  
    return (validate.errors || []).map(err => ({
      field:   err.instancePath.replace(/^\//, ''), 
      message: err.message || 'Invalid value'
    }));
}

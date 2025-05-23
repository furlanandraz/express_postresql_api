// modules/processors/prisma-to-json-schemas.js
import fs from 'fs';
import path from 'path';
import pkg from '@prisma/internals';
const { getDMMF } = pkg;

/** snake_or_camel → Title Case */
function toTitleCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .split(/[_\s]/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Quick & dirty parser to extract @@schema("…") per model
 */
function parseSchemaMap(prismaSchemaText) {
  const modelBlock = /model\s+(\w+)\s*{([\s\S]*?)}/g;
  const map = {};
  let m;
  while ((m = modelBlock.exec(prismaSchemaText))) {
    const [, modelName, body] = m;
    const schemaMatch = body.match(/@@schema\s*\(\s*["']([^"']+)["']\s*\)/);
    map[modelName] = schemaMatch ? schemaMatch[1] : 'public';
  }
  return map;
}

/** Prisma→JSON-Schema type mapping */
function mapType(prismaType) {
  switch (prismaType) {
    case 'String':   return 'string';
    case 'Int':      return 'integer';
    case 'Float':    return 'number';
    case 'Boolean':  return 'boolean';
    case 'DateTime': return 'string';
    case 'Json':     return ['number','string','boolean','object','array','null'];
    default:         return 'string';  // covers enums too
  }
}

async function main() {
  const root       = process.cwd();
  const schemaPrisma = path.join(root, 'prisma', 'schema.prisma');
  const outDir     = path.join(root, 'static', 'forms');

  // 1) read & parse schema.prisma
  const prismaText = fs.readFileSync(schemaPrisma, 'utf-8');
  const schemaMap  = parseSchemaMap(prismaText);

  // 2) get the DMMF (your Prisma models + fields)
  const dmmf = await getDMMF({ datamodel: prismaText });

  // 3) ensure output folder
  fs.mkdirSync(outDir, { recursive: true });

  // 4) for each model in your Prisma schema…
  for (const model of dmmf.datamodel.models) {
    const modelName  = model.name;                // e.g. "Route"
    const schemaName = schemaMap[modelName] || 'public';
    const props      = {};
    const required   = [];

    // 4a) walk fields, pick only scalars/enums (skip relations)
    for (const field of model.fields) {
      if (field.kind !== 'scalar') continue;

      let jsType = mapType(field.type);
      const prop = { type: jsType };

      // enums → list allowed values
      if (field.kind === 'enum') {
        prop.enum = field.enumValues;
      }

      // literal defaults
      if (field.hasDefaultValue && field.default?.kind === 'literal') {
        prop.default = field.default.value;
      }

      // nullability
      if (!field.isRequired) {
        // union with null
        prop.type = Array.isArray(jsType) ? [...jsType, 'null'] : [jsType, 'null'];
      } else if (!field.hasDefaultValue) {
        required.push(field.name);
      }

      // title-case the label
      prop.title = toTitleCase(field.name);

      props[field.name] = prop;
    }

    // 4b) assemble JSON-Schema
    const schema = {
      $schema:   'http://json-schema.org/draft-07/schema#',
      title:     toTitleCase(modelName),
      type:      'object',
      properties: props,
    };
    if (required.length) {
      schema.required = required;
    }

    // 4c) write to static/types/jsons/<schema>_<model>.json
    const fileName = `${schemaName.toLowerCase()}_${modelName}.json`;
    const outPath  = path.join(outDir, fileName);
    fs.writeFileSync(outPath, JSON.stringify(schema, null, 2), 'utf-8');
    console.log(`✔ wrote ${path.relative(root, outPath)}`);
  }

  console.log('✅ All schemas generated!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

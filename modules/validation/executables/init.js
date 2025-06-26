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

/** Extract schema name from @@schema("...") directives in Prisma schema */
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

/** Maps Prisma scalar type to JSON Schema type */
function mapType(field) {
  const t = field.type;
  switch (t) {
    case 'String':   return 'string';
    case 'Int':      return 'integer';
    case 'Float':    return 'number';
    case 'Boolean':  return 'boolean';
    case 'DateTime': return 'string';
    case 'Json': {
      const pgType = field.dbNames?.[0] || 'json';
      return pgType === 'jsonb'
        ? ['object', 'array', 'string', 'number', 'boolean', 'null']
        : ['string', 'number', 'boolean', 'object', 'array', 'null'];
    }
    default:
      return 'string'; // fallback for enums or unknown types
  }
}

async function main() {
  const root         = process.cwd();
  const schemaPrisma = path.join(root, 'prisma', 'schema.prisma');
  const outDir       = path.join(root, 'modules', 'validation', 'database');

  const prismaText   = fs.readFileSync(schemaPrisma, 'utf-8');
  const schemaMap    = parseSchemaMap(prismaText);
  const dmmf         = await getDMMF({ datamodel: prismaText });

  const enumMap = {};
  for (const enumDef of dmmf.datamodel.enums) {
    enumMap[enumDef.name] = enumDef.values.map(v => v.name);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const model of dmmf.datamodel.models) {
    const modelName  = model.name;
    const schemaName = schemaMap[modelName] || 'public';
    const props      = {};
    const required   = [];

    for (const field of model.fields) {
      if (field.kind !== 'scalar' && field.kind !== 'enum') continue;

      let type = mapType(field);
      const prop = { type };

      if (field.kind === 'enum' || enumMap[field.type]) {
        prop.type = 'string';
        prop.enum = enumMap[field.type];
        prop.custom_type = field.type; // ← Add custom_type for enum name
      }

      if (!field.isRequired) {
        prop.type = Array.isArray(prop.type)
          ? [...new Set([...prop.type, 'null'])]
          : [prop.type, 'null'];
      } else if (!field.hasDefaultValue) {
        required.push(field.name);
      }

      prop.title = toTitleCase(field.name);
      props[field.name] = prop;
    }

    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: `${schemaName}.${modelName}`,
      type: 'object',
      properties: props
    };

    if (required.length) {
      schema.required = required;
    }

    const fileName = `${schemaName.toLowerCase()}.${modelName}.json`;
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

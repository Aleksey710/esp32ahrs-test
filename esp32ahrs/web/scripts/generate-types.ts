import fs from "fs-extra";
import yaml from "js-yaml";

const spec = yaml.load(fs.readFileSync("./asyncapi/asyncapi.yaml", "utf-8")) as any;

function tsType(schema: any): string {
  if (!schema) return "any";

  if (schema.type === "string") return "string";
  if (schema.type === "number" || schema.type === "integer") return "number";
  if (schema.type === "boolean") return "boolean";

  if (schema.type === "object") {
    const props = schema.properties || {};
    const req = schema.required || [];

    const fields = Object.entries(props).map(([k, v]: any) => {
      const optional = req.includes(k) ? "" : "?";
      return `${k}${optional}: ${tsType(v)}`;
    });

    return `{ ${fields.join("; ")} }`;
  }

  if (schema.allOf) {
    return schema.allOf.map(tsType).join(" & ");
  }

  return "any";
}

function generateTypes() {
  const schemas = spec.components.schemas;

  let out = `// AUTO-GENERATED TYPES\n\n`;

  for (const [name, schema] of Object.entries<any>(schemas)) {
    out += `export interface ${name} ${tsType(schema)}\n\n`;
  }

  fs.outputFileSync("./generated/types.ts", out);
}

generateTypes();

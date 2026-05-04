"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchemaModule = generateSchemaModule;
function generateSchemaModule(spec) {
    const messages = spec.components?.messages ?? {};
    let code = `// AUTO-GENERATED SCHEMAS + TYPES\n\n`;
    for (const [name, msg] of Object.entries(messages)) {
        const schema = msg.payload;
        code += generateType(name, schema);
        code += "\n";
        code += generateValidator(name, schema);
        code += "\n";
    }
    return code;
}
function generateType(name, schema) {
    return `
export type ${name} = ${toTS(schema)};
`;
}
function toTS(schema) {
    if (!schema)
        return "any";
    switch (schema.type) {
        case "string":
            return "string";
        case "number":
        case "integer":
            return "number";
        case "boolean":
            return "boolean";
        case "array":
            return `${toTS(schema.items)}[]`;
        case "object": {
            const props = schema.properties ?? {};
            const fields = Object.entries(props)
                .map(([k, v]) => {
                const optional = schema.required?.includes(k) ? "" : "?";
                return `${k}${optional}: ${toTS(v)};`;
            })
                .join("\n");
            return `{
${fields}
}`;
        }
        default:
            return "any";
    }
}
function generateValidator(name, schema) {
    return `
export function validate${name}(data: any): boolean {
    return ${generateCheck("data", schema)};
}
`;
}
function generateCheck(path, schema) {
    if (!schema)
        return "true";
    switch (schema.type) {
        case "string":
            return `typeof ${path} === "string"`;
        case "number":
        case "integer":
            return `typeof ${path} === "number"`;
        case "boolean":
            return `typeof ${path} === "boolean"`;
        case "array":
            return `
Array.isArray(${path}) &&
${path}.every((i: any) => ${generateCheck("i", schema.items)})
            `.trim();
        case "object": {
            const props = schema.properties ?? {};
            const required = schema.required ?? [];
            const checks = Object.entries(props).map(([k, v]) => {
                const exists = required.includes(k)
                    ? `${path}.${k} !== undefined`
                    : "true";
                const typeCheck = generateCheck(`${path}.${k}`, v);
                return `(${exists} && ${typeCheck})`;
            });
            return checks.length ? checks.join(" && ") : "true";
        }
        default:
            return "true";
    }
}

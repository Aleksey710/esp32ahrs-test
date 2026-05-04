function mapType(type: string): string {
    switch (type) {
        case "string": return "string";
        case "number":
        case "integer": return "number";
        case "boolean": return "boolean";
        case "array": return "any[]";
        case "object": return "Record<string, any>";
        default: return "any";
    }
}
export function generateTypes(spec: any): string {
    const messages = spec.components?.messages ?? {};

    let code = `// AUTO-GENERATED TYPES\n\n`;

    for (const [name, msg] of Object.entries(messages)) {
        const payload = (msg as any).payload;

        code += `export interface ${name} ${render(payload)}\n\n`;
    }

    return code;
}

function render(schema: any): string {
    if (!schema) return `{}`;

    if (schema.type === "object") {
        const props = schema.properties ?? {};

        const fields = Object.entries(props)
            .map(([k, v]: any) => {
                const t =
                    v.type === "number"
                        ? "number"
                        : v.type === "string"
                        ? "string"
                        : "any";

                return `    ${k}: ${t};`;
            })
            .join("\n");

        return `{\n${fields}\n}`;
    }

    return `{}`;
}

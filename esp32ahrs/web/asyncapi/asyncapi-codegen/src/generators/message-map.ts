export function generateMessageMap(spec: any): string {
  const messages = spec.components?.messages ?? {};

  let code = `import * as Msg from "./types";\n\n`;
  code += `export type MessageMap = {\n`;

  for (const name of Object.keys(messages)) {
    code += `  ${name}: Msg.${name};\n`;
  }

  code += `};\n`;

  return code;
}

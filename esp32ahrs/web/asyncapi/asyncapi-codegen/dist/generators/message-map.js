"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessageMap = generateMessageMap;
function generateMessageMap(spec) {
    const messages = spec.components?.messages ?? {};
    let code = `import * as Msg from "./types";\n\n`;
    code += `export type MessageMap = {\n`;
    for (const name of Object.keys(messages)) {
        code += `  ${name}: Msg.${name};\n`;
    }
    code += `};\n`;
    return code;
}

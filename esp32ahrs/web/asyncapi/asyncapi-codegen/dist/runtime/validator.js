"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayload = validatePayload;
function validatePayload(schema, payload) {
    if (!schema || !payload)
        return true;
    if (schema.type === "object") {
        const props = schema.properties ?? {};
        for (const key of Object.keys(props)) {
            const prop = props[key];
            if (prop.type === "number" && typeof payload[key] !== "number") {
                return false;
            }
            if (prop.type === "string" && typeof payload[key] !== "string") {
                return false;
            }
        }
    }
    return true;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRef = resolveRef;
function resolveRef(ref, spec) {
    const parts = ref.replace("#/", "").split("/");
    let current = spec;
    for (const part of parts) {
        current = current?.[part];
    }
    return current;
}

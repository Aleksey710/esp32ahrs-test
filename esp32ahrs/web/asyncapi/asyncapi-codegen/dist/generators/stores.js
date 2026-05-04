"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStores = generateStores;
const case_1 = require("../utils/case");
function getMessageName(op) {
    return op.messages?.[0]?.$ref?.split("/").pop() ?? null;
}
function generateStores(spec) {
    const result = {};
    for (const [channelName] of Object.entries(spec.channels)) {
        const ops = Object.values(spec.operations ?? {});
        const receives = ops.filter((o) => o.action === "receive");
        const sends = ops.filter((o) => o.action === "send");
        let code = `
import { defineStore } from "pinia";
import { APIClient } from "../client";
import * as Msg from "../types";

const client = new APIClient();

export const use${(0, case_1.pascal)(channelName)}Store = defineStore("${channelName}", {
    state: () => ({
        connected: false,
        data: null as unknown,
    }),

    actions: {
        connect() {
            client.connect();
`;
        for (const op of receives) {
            const msg = getMessageName(op);
            if (!msg)
                continue;
            code += `
            client.on("${msg}", (payload: Msg.${msg}) => {
                this.data = payload;
            });
`;
        }
        for (const op of sends) {
            const msg = getMessageName(op);
            if (!msg)
                continue;
            code += `
        ${op.name}(payload: Msg.${msg}) {
            client.send("${msg}", payload);
        }
`;
        }
        code += `
        }
    }
});
`;
        result[channelName] = code;
    }
    return result;
}

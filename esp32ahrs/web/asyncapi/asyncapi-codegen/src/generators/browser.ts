import { pascal } from "../utils/case";

export function generateBrowserStores(spec: any): Record<string, string> {
    const result: Record<string, string> = {};

    for (const channelName of Object.keys(spec.channels ?? {})) {
        const ops = Object.values(spec.operations ?? {}) as any[];

        const receives = ops.filter((o) => o.action === "receive");
        const sends = ops.filter((o) => o.action === "send");

        let code = `
import { defineStore } from "pinia";
import { APIClient } from "../client";
import * as Msg from "../types";

const client = new APIClient();

export const use${pascal(channelName)}Store = defineStore("${channelName}", {
    state: () => ({
        connected: false,
        data: null as unknown
    }),

    actions: {
        connect() {
            client.connect();
`;

        for (const op of receives) {
            const msg = getMsg(op);
            if (!msg) continue;

            code += `
            client.on("${msg}", (payload: Msg.${msg}) => {
                this.data = payload;
            });
`;
        }

        for (const op of sends) {
            const msg = getMsg(op);
            if (!msg) continue;

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

function getMsg(op: any): string | null {
    return op.messages?.[0]?.$ref?.split("/").pop() ?? null;
}

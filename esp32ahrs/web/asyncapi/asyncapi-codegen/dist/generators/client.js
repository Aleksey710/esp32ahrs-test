"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClient = generateClient;
const analyze_server_1 = require("../core/analyze-server");
function generateClient(spec) {
    const server = (0, analyze_server_1.analyzeServer)(spec);
    if (!server.valid) {
        return `
export class APIClient {
    connect() {
        console.warn("Mock client (unsupported protocol)");
    }

    disconnect() {}
}
`;
    }
    return `
import { validatePayload } from "../runtime/validator";

export class APIClient {
    private ws?: WebSocket;

    connect() {
        this.ws = new WebSocket("${server.url}");

        this.ws.onopen = () => {
            console.log("[WS] connected");
        };

        this.ws.onclose = () => {
            console.log("[WS] disconnected");
        };

        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            this.handleMessage(msg.type, msg.payload);
        };
    }

    disconnect() {
        this.ws?.close();
    }

    private handlers: Record<string, Function[]> = {};

    on(type: string, cb: Function) {
        if (!this.handlers[type]) this.handlers[type] = [];
        this.handlers[type].push(cb);
    }

    send(type: string, payload: any) {
        this.ws?.send(JSON.stringify({ type, payload }));
    }

    private handleMessage(type: string, payload: any) {
        const cbs = this.handlers[type] ?? [];

        for (const cb of cbs) {
            cb(payload);
        }
    }
}
`;
}

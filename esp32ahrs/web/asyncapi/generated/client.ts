
import { validatePayload } from "../runtime/validator";

export class APIClient {
    private ws?: WebSocket;

    connect() {
        this.ws = new WebSocket("ws://192.168.234.12");

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

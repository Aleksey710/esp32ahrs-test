
import { defineStore } from "pinia";
import { APIClient } from "../client";
import * as Msg from "../types";

const client = new APIClient();

export const useControlStore = defineStore("control", {
    state: () => ({
        connected: false,
        data: null as unknown
    }),

    actions: {
        connect() {
            client.connect();

            client.on("ahrs", (payload: Msg.ahrs) => {
                this.data = payload;
            });

            client.on("acknowledge", (payload: Msg.acknowledge) => {
                this.data = payload;
            });

        undefined(payload: Msg.heartbeat) {
            client.send("heartbeat", payload);
        }

        undefined(payload: Msg.hello) {
            client.send("hello", payload);
        }

        }
    }
});

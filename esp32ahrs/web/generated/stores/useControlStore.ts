
import { defineStore } from "pinia";
import { ESP32API } from "../generated/api";

const client = new ESP32API("ws://192.168.234.12/link");

export const useControlStore = defineStore("control", {
  state: () => ({
    connected: false,
    data: null as unknown,
  }),

  actions: {
    connect() {
      client.connect();
      this.connected = true;

      client.on("acknowledge", (payload) => {
        this.data = payload;
      });

    undefined(payload: unknown) {
      client.send("heartbeat", payload);
    }

    undefined(payload: unknown) {
      client.send("hello", payload);
    }

    }
  }
});

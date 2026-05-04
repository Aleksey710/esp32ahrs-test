
import { defineStore } from "pinia";
import { ESP32API } from "../generated/api";

const client = new ESP32API("ws://192.168.234.12/link");

export const useTelemetryStore = defineStore("telemetry", {
  state: () => ({
    connected: false,
    data: null as unknown,
  }),

  actions: {
    connect() {
      client.connect();
      this.connected = true;

      client.on("ahrs", (payload) => {
        this.data = payload;
      });

    }
  }
});

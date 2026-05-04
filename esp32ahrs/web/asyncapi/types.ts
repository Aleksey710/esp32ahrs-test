import { ESP32Client } from "./client";
import type { hello, heartbeat, ahrs, acknowledge } from "./types";

export class ESP32API extends ESP32Client {

  onAhrs(cb: (data: ahrs) => void) {
    this.on("ahrs", cb);
  }

  onAck(cb: (data: acknowledge) => void) {
    this.on("acknowledge", cb);
  }

  sendHello(data: hello) {
    this.send("hello", data);
  }

  sendHeartbeat(data: heartbeat) {
    this.send("heartbeat", data);
  }
}

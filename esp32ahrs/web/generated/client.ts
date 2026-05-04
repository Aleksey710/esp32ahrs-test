
export class ESP32Client {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = {};
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const type = data.type;

      const handler = this.handlers[type];
      if (handler) handler(data);
    };
  }

  on(type, cb) {
    this.handlers[type] = cb;
  }

  onAhrs(cb) {
    this.on("ahrs", cb);
  }

  sendHeartbeat(payload = {}) {
    this.ws.send(JSON.stringify({
      ...payload,
      type: "heartbeat"
    }));
  }

  sendSendHello(payload = {}) {
    this.ws.send(JSON.stringify({
      ...payload,
      type: "hello"
    }));
  }

  onReceiveAck(cb) {
    this.on("acknowledge", cb);
  }

}

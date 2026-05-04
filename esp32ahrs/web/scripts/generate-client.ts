import fs from "fs-extra";
import yaml from "js-yaml";

const file = "./asyncapi/asyncapi.yaml";

function loadSpec() {
  return yaml.load(fs.readFileSync(file, "utf-8")) as any;
}

function pascal(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildOperations(spec: any) {
  const ops = spec.operations;
  const result: any[] = [];

  for (const [name, op] of Object.entries<any>(ops)) {
    const msgRef = op.messages?.[0]?.["$ref"];
    const msgName = msgRef.split("/").pop();

    result.push({
      name,
      action: op.action,
      message: msgName
    });
  }

  return result;
}

function generate(spec: any) {
  const ops = buildOperations(spec);

  let code = `
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
`;

  for (const op of ops) {
    const name = pascal(op.name);

    if (op.action === "receive") {
      code += `
  on${name}(cb) {
    this.on("${op.message}", cb);
  }
`;
    }

    if (op.action === "send") {
      code += `
  send${name}(payload = {}) {
    this.ws.send(JSON.stringify({
      ...payload,
      type: "${op.message}"
    }));
  }
`;
    }
  }

  code += "\n}\n";

  return code;
}

async function main() {
  const spec = loadSpec();
  const client = generate(spec);

  await fs.outputFile("./generated/client.ts", client);

  console.log("✔ AsyncAPI client generated");
}

main();

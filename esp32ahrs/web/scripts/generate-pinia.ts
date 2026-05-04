import fs from "fs-extra";
import yaml from "js-yaml";

/**
 * Минимальные типы AsyncAPI (достаточные для генерации)
 */

type Ref = {
  $ref: string;
};

type Operation = {
  name: string;
  action: "send" | "receive";
  channel: Ref;
  messages: Ref[];
};

type Spec = {
  operations: Record<string, Operation>;
  channels: Record<string, unknown>;
};

/**
 * Парсинг YAML с типом
 */
const spec = yaml.load(
  fs.readFileSync("./asyncapi/asyncapi.yaml", "utf-8")
) as Spec;

/**
 * Утилиты
 */
function pascal(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getMessageName(op: Operation): string | null {
  const ref = op.messages?.[0]?.$ref;
  if (!ref) return null;

  return ref.split("/").pop() ?? null;
}

/**
 * Генерация store
 */
function genStore(channelName: string): string {
  const operations = Object.values(spec.operations);

  const ops = operations.filter((op) =>
    op.channel.$ref.includes(channelName)
  );

  const receives = ops.filter((o) => o.action === "receive");
  const sends = ops.filter((o) => o.action === "send");

  let code = `
import { defineStore } from "pinia";
import { ESP32API } from "../generated/api";

const client = new ESP32API("ws://192.168.234.12/link");

export const use${pascal(channelName)}Store = defineStore("${channelName}", {
  state: () => ({
    connected: false,
    data: null as unknown,
  }),

  actions: {
    connect() {
      client.connect();
      this.connected = true;
`;

  /**
   * RECEIVE handlers
   */
  for (const op of receives) {
    const msg = getMessageName(op);
    if (!msg) continue;

    code += `
      client.on("${msg}", (payload) => {
        this.data = payload;
      });
`;
  }

  /**
   * SEND actions
   */
  for (const op of sends) {
    const msg = getMessageName(op);
    if (!msg) continue;

    code += `
    ${op.name}(payload: unknown) {
      client.send("${msg}", payload);
    }
`;
  }

  code += `
    }
  }
});
`;

  return code;
}

/**
 * Главная функция генерации
 */
function generate(): void {
  const channels = spec.channels;

  for (const name of Object.keys(channels)) {
    const store = genStore(name);

    fs.outputFileSync(
      `./generated/stores/use${pascal(name)}Store.ts`,
      store
    );
  }

  console.log("✔ Pinia stores generated");
}

generate();

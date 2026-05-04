export type ServerInfo = {
  host: string;
  protocol: string;
};

export function analyzeServer(spec: any): {
  valid: boolean;
  url: string | null;
  protocol: string | null;
} {
  const server = spec.servers?.production;

  if (!server) {
    return { valid: false, url: null, protocol: null };
  }

  const protocol = server.protocol;

  const host = server.host;

  const isWs = protocol === "ws" || protocol === "wss";

  if (!isWs) {
    console.warn(
      `[asyncapi-codegen] Unsupported protocol: ${protocol}. Using mock client.`
    );

    return {
      valid: false,
      url: null,
      protocol
    };
  }

  return {
    valid: true,
    url: `${protocol}://${host}`,
    protocol
  };
}

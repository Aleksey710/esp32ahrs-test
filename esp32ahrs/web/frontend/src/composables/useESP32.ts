import { ref, onMounted } from "vue";
import { ESP32API } from "../generated/api";

export function useESP32() {
  const client = new ESP32API("ws://192.168.234.12/link");

  const ahrs = ref(null);
  const connected = ref(false);

  onMounted(() => {
    client.connect();

    client.onAhrs((data) => {
      ahrs.value = data;
    });

    connected.value = true;
  });

  return {
    client,
    ahrs,
    connected
  };
}

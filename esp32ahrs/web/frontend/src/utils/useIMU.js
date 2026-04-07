// useIMU.js
import { ref } from 'vue'

export function useIMU() {
  const data = ref(null)

  const ws = new WebSocket('ws://localhost:8080')

  ws.onmessage = (e) => {
    data.value = JSON.parse(e.data)
  }

  return { data }
}

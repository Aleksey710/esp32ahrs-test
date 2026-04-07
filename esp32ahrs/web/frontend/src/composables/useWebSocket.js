import { ref, reactive } from 'vue'

const ws = ref(null)
const isConnected = ref(false)

// глобальное состояние (реактивное!)
const state = reactive({
  imu: {
    g: { x: 0, y: 0, z: 0 },
    a: { x: 0, y: 0, z: 0 }
  },
  m: { x: 0, y: 0, z: 0 },
  timestamp: 0
})

function wsConnect(url = 'ws://localhost:8080') {
  if (ws.value) return

  ws.value = new WebSocket(url)

  ws.value.onopen = () => {
    console.log('WS connected')
    isConnected.value = true
  }

  ws.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      // 🔥 обновляем реактивное состояние
      if (data.imu) {
        if (data.imu.g) state.imu.g = data.imu.g
        if (data.imu.a) state.imu.a = data.imu.a
      }

      if (data.m) state.m = data.m
      if (data.timestamp) state.timestamp = data.timestamp

    } catch (e) {
      console.error('WS parse error', e)
    }
  }

  ws.value.onclose = () => {
    console.log('WS disconnected')
    isConnected.value = false
    ws.value = null

    // авто-реконнект
    setTimeout(() => connect(url), 2000)
  }
}

export function useWebSocket() {
  return {
    wsConnect,
    state,
    isConnected
  }
}

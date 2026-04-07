import { defineStore } from 'pinia'

export const useWsStore = defineStore('ws', {
  state: () => ({
    imu: { g: {}, a: {} },
    m: {},
    connected: false
  }),

  actions: {
    connect() {
      const ws = new WebSocket('ws://...')

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        this.imu = data.imu || this.imu
        this.m = data.m || this.m
      }
    }
  }
})

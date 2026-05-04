import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(async () => {
  const { visualizer } = await import('rollup-plugin-visualizer')

  return {
    root: 'frontend',

    resolve: {
      tsconfigPaths: true
    },

    plugins: [
      vue(),
      visualizer({
        open: true,
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true
      })
    ],

    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/app.js'
        }
      }
    },

    server: {
      port: 5173
    }
  }
})

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	root: 'frontend',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './frontend/src') // 🔥 ключевая строка
		}
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: 'assets/app.js',
			}
		}
	},
	server: {
		port: 5173
	}
});

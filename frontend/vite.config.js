import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: { quietDeps: true, silenceDeprecations: ['import'] },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.e2b.app'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6060',
        changeOrigin: true,
      },
    },
  },
})

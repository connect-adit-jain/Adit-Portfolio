import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // exposes on 0.0.0.0 and prints local network IP (192.168.x.x)
    port: 5173,
  },
  preview: {
    host: true, // exposes preview on local network IP
    port: 4173,
  },
})

import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// vite.config.js

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker tracking
    port: 5173, // Default Vite port
    watch: {
      usePolling: true, // Fixes hot-reload issues on Windows/WSL
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT || 3001,
    allowedHosts: ['spanish.danzaharia.com', '.danzaharia.com', 'all']
  }
})

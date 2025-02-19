import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Spanish Coach',
        short_name: 'SpanishCoach',
        description: 'Your personal Spanish language learning assistant',
        theme_color: '#FCFCFD',
        background_color: '#FCFCFD',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Spanish Coach Desktop View'
          },
          {
            src: 'screenshot-mobile.png',
            sizes: '750x1334',
            type: 'image/png',
            label: 'Spanish Coach Mobile View'
          }
        ]
      }
    })
  ],
  server: {
    port: process.env.VITE_PORT || 3001,
    allowedHosts: ['spanish.danzaharia.com', '.danzaharia.com', "*.railway.app", 'all']
  },
  preview: {
    allowedHosts: ['spanish.danzaharia.com', '.danzaharia.com', "*.railway.app", 'all']
  }
})

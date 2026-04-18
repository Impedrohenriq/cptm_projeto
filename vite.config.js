import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/vue/') ||
              id.includes('/vue-router/') ||
              id.includes('/pinia/')
            ) {
              return 'vendor'
            }

            if (id.includes('/dexie/')) {
              return 'offline'
            }

            if (
              id.includes('/workbox-') ||
              id.includes('/workbox/') ||
              id.includes('/virtual:pwa-register/') ||
              id.includes('/vite-plugin-pwa/')
            ) {
              return 'pwa'
            }
          }
        }
      }
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'CPTM Ambiental — Controle Ambiental',
        short_name: 'CPTM Ambiental',
        description: 'Sistema de registro e monitoramento de ocorrências ambientais nas dependências da CPTM.',
        theme_color: '#C8102E',
        background_color: '#C8102E',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'pt-BR',
        start_url: '/',
        icons: [
          {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='24' fill='%23C8102E'/%3E%3Ctext x='96' y='110' font-family='Arial' font-size='60' font-weight='900' fill='white' text-anchor='middle'%3ECPTM%3C/text%3E%3C/svg%3E",
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='64' fill='%23C8102E'/%3E%3Ctext x='256' y='300' font-family='Arial' font-size='160' font-weight='900' fill='white' text-anchor='middle'%3ECPTM%3C/text%3E%3C/svg%3E",
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Nova Inspeção',
            short_name: 'Nova',
            url: '/formulario',
            description: 'Iniciar uma nova inspeção ambiental'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

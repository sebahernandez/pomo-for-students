import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Analytics de Vercel y verificación de Search Console quedan fuera del SW.
        navigateFallbackDenylist: [/^\/_vercel\//],
      },
      manifest: {
        name: 'Pomodoro For Students',
        short_name: 'Pomo Study',
        description:
          'Temporizador Pomodoro con tablero Kanban para estudiantes: enfoca tus tareas, toma descansos y revisa tu historial de sesiones.',
        lang: 'es',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})

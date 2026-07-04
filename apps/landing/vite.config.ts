import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tanstackStart({
      // autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : undefined,
    }),
  ],
  base: '/',
  server: {
    port: 6300,
  },
})

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
      ...(process.env.VERCEL
        ? {
            output: {
              // Monorepo root is two levels up; Vercel expects Build Output API at repo/.vercel/output
              dir: '../../.vercel/output',
            },
          }
        : {}),
    }),
  ],
  base: '/',
  server: {
    port: 6300,
  },
})

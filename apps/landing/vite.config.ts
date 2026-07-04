import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import { paraglideCompilerOptions } from './project.inlang/paraglide.options'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    paraglideVitePlugin(paraglideCompilerOptions),
    tanstackStart(),
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

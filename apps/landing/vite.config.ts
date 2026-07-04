import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }
import { paraglideCompilerOptions } from './project.inlang/paraglide.options'

const siteManifest = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'public/site.webmanifest'), 'utf8')
) as { theme_color: string }

export default defineConfig(() => ({
  resolve: { tsconfigPaths: true },
  define: {
    __ORIGIN_POLYMS__: JSON.stringify('https://polyms.dev'),
    __THEME_COLOR__: JSON.stringify(siteManifest.theme_color),
    __VERSION__: JSON.stringify(pkg.version),
    __GLITCHTIP_DSN__: JSON.stringify('https://e7a42f891e244b298ea4127cce0c76d0@monitor.polyms.dev/1'),
    __PHONE__: JSON.stringify('+84 918 168 159'),
    __EMAIL__: JSON.stringify('hello@polyms.dev'),
  },
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
  server: {
    port: 6300,
  },
}))

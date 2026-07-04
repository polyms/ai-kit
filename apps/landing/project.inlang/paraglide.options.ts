import type { CompilerOptions } from '@inlang/paraglide-js'

// Nguồn sự thật duy nhất cho Paraglide — dùng chung vite.config.ts và scripts/compile-i18n.ts.
// KHÔNG chạy `paraglide-js compile` (CLI) trực tiếp vì bỏ qua strategy/cookieName.
export const paraglideCompilerOptions: CompilerOptions = {
  project: './project.inlang',
  outdir: './src/paraglide',
  strategy: ['cookie', 'globalVariable', 'baseLocale'],
  cookieName: 'ai-kit.locale',
  isServer: 'import.meta.env.SSR',
}

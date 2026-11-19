import { Button, Toast } from '@polyms/ui-kit'
import { CodeSquare, LinkRound, Structure } from '@solar-icons/react-perf/BoldDuotone'
import { createFileRoute } from '@tanstack/react-router'
import { HomeFooter, HomeHeader } from '../components/home'
import { HomeSectionChip } from '../components/home/HomeSectionChip'
import { copyText } from '../lib/copy'
import { IconCopy } from '../lib/icons'
import { m } from '../paraglide/messages.js'

const INSTALL = 'pnpm add @polyms/ai-kit-sdk'
const CONFIG = '@polyms:registry=https://registry.polyms.dev/npm'
const SETUP = `import { createSkillProvider } from '@polyms/ai-kit-sdk'

const provider = createSkillProvider({
  endpoint: 'https://ai-kit.polyms.dev',
})

// Optional warm-up; reuse provider across requests.
await provider.preload(['reqs'])

// Inside your MCP tool handler:
const skill = await provider.getSkill('reqs')
// Return instructions with authorized project context.`
const EXTEND = `import { extendSkill } from '@polyms/ai-kit-sdk'

const base = await provider.getSkill('reqs')
const workflow = extendSkill(base, {
  name: 'product-reqs',
  extends: 'ai-kit/reqs@' + base.version,
  instructions: 'Preserve project IDs.',
})`
const REFERENCE = `const template = await provider.getSkill('reqs', {
  paths: ['skills/reqs/enterprise-prd-template.md'],
})`
const HTTP = `curl https://ai-kit.polyms.dev/skill-bundles/0.3.1/reqs/starter.json

curl -X POST https://ai-kit.polyms.dev/api/skills \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"reqs","version":"0.3.1","paths":["skills/reqs/enterprise-prd-template.md"]}'`

function CodeSample({ label, code }: { label: string; code: string }) {
  const toast = Toast.useToastManager()
  return (
    <div className='app-terminal min-w-0 overflow-hidden rounded-2xl'>
      <div className='app-terminal__bar flex items-center justify-between gap-3 px-4 py-2'>
        <span className='app-terminal__title font-mono text-[11px]'>{label}</span>
        <Button rounded size='sm' variant='light' onClick={async () => {
          const ok = await copyText(code)
          toast.add({ title: ok ? m.catalog_copied() : m.catalog_copyFail(), type: ok ? 'success' : 'danger' })
        }}>
          <IconCopy aria-hidden size={14} /> {m.catalog_copy()}
        </Button>
      </div>
      <pre className='app-terminal__text m-0 overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed'><code>{code}</code></pre>
    </div>
  )
}

function SdkPage() {
  const features = [
    { icon: Structure, title: m.sdk_feature_static(), body: m.sdk_feature_static_body() },
    { icon: CodeSquare, title: m.sdk_feature_cache(), body: m.sdk_feature_cache_body() },
    { icon: LinkRound, title: m.sdk_feature_extend(), body: m.sdk_feature_extend_body() },
  ]
  return (
    <main className='app-page min-h-dvh'>
      <HomeHeader />
      <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='content'>
        <span className='badge badge-primary mb-5 inline-flex font-mono'>TYPESCRIPT · BUSINESS MCP</span>
        <h1 className='app-pipeline__title m-0 mb-4 font-bold font-sans text-fg'>{m.sdk_title()}</h1>
        <p className='mb-6 max-w-[720px] text-[17px] text-muted leading-relaxed'>{m.sdk_intro()}</p>
        <div className='mb-8 flex flex-wrap gap-3'>
          <Button render={<a href='#installation' />} rounded size='lg' variant='primary'>{m.sdk_install_title()}</Button>
          <Button render={<a href='#http-api' />} rounded size='lg' variant='light'>{m.sdk_http_title()}</Button>
        </div>
        <p className='mb-8 text-sm text-muted'>{m.sdk_release_note()}</p>
        <div className='grid gap-5 md:grid-cols-3'>
          {features.map(({ icon: Icon, title, body }) => (
            <div className='rounded-[24px] border border-line bg-body p-6' key={title}>
              <span className='app-catalog-card__icon mb-4 flex size-11 items-center justify-center rounded-full'>
                <Icon aria-hidden className='text-primary-600' size={22} />
              </span>
              <h2 className='mb-2 font-bold text-[18px] text-fg'>{title}</h2>
              <p className='m-0 text-sm text-muted leading-relaxed'>{body}</p>
            </div>
          ))}
        </div>
        <div className='mt-8 rounded-[24px] border border-line bg-body p-6'>
          <div className='grid items-center gap-3 sm:grid-cols-3'>
            {['Business MCP', 'AI Kit SDK', 'Static bundles / CDN'].map(label => (
              <div key={label} className='rounded-xl border border-line bg-surface p-4 text-center font-bold text-fg'>{label}</div>
            ))}
          </div>
          <p className='mt-4 mb-0 text-sm text-muted'>{m.sdk_architecture()}</p>
        </div>
      </section>
      <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='installation'>
        <HomeSectionChip label={m.sdk_install_title()} n='01' />
        <h2 className='app-pipeline__title mb-3 font-bold text-fg'>{m.sdk_install_title()}</h2>
        <p className='mb-5 text-muted'>{m.sdk_install_body()}</p>
        <div className='grid gap-4'>
          <CodeSample label='.npmrc' code={CONFIG} />
          <CodeSample label='terminal' code={INSTALL} />
        </div>
        <h3 className='mt-8 mb-3 font-bold text-xl text-fg'>{m.sdk_setup_title()}</h3>
        <p className='mb-4 text-muted'>{m.sdk_setup_body()}</p>
        <CodeSample label='TypeScript' code={SETUP} />
      </section>
      <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='usage'>
        <HomeSectionChip label={m.sdk_usage_title()} n='02' />
        <h2 className='app-pipeline__title mb-3 font-bold text-fg'>{m.sdk_usage_title()}</h2>
        <p className='mb-4 text-muted'>{m.sdk_reference_body()}</p>
        <CodeSample label='TypeScript · selective retrieval' code={REFERENCE} />
        <h3 className='mt-8 mb-3 font-bold text-xl text-fg'>{m.sdk_feature_extend()}</h3>
        <p className='mb-4 text-muted'>{m.sdk_feature_extend_body()}</p>
        <CodeSample label='TypeScript · domain extension' code={EXTEND} />
        <div className='mt-8 rounded-[24px] border border-line bg-body p-6'>
          <h3 className='mb-3 font-bold text-xl text-fg'>{m.sdk_methods_title()}</h3>
          {[
            ['list()', m.sdk_method_list()],
            ['getSkill(name, selection)', m.sdk_method_get()],
            ['preload(names, version)', m.sdk_method_preload()],
            ['clearCache()', m.sdk_method_clear()],
            ['extendSkill(bundle, extension)', m.sdk_feature_extend_body()],
          ].map(([method, desc]) => (
            <div key={method} className='grid gap-2 border-b border-line py-3 last:border-b-0 sm:grid-cols-2'>
              <code className='break-all font-mono text-sm text-primary-600'>{method}</code>
              <span className='text-sm text-muted'>{desc}</span>
            </div>
          ))}
        </div>
      </section>
      <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='http-api'>
        <HomeSectionChip label='HTTP API' n='03' />
        <h2 className='app-pipeline__title mb-3 font-bold text-fg'>{m.sdk_http_title()}</h2>
        <p className='mb-4 text-muted'>{m.sdk_http_body()}</p>
        <CodeSample label='curl' code={HTTP} />
        <p className='mt-5 text-sm text-muted'>{m.sdk_security()}</p>
        <p className='mt-3 text-sm text-muted'>{m.sdk_performance_note()}</p>
      </section>
      <HomeFooter />
    </main>
  )
}

export const Route = createFileRoute('/sdk')({
  head: () => ({ meta: [{ title: 'AI Kit SDK | Polyms' }, { name: 'description', content: 'Versioned skill delivery for Business MCP servers. Integration guide and HTTP API.' }] }),
  component: SdkPage,
})

import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { IconCodeSquare, IconTuning2 } from '../../lib/icons'
import type { SkillsSearch } from '../../lib/skills-search'
import { mergeSkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/skills/')({
  component: SkillsIndexPage,
})

const BOOTSTRAP_STEPS = [
  { id: 'clone-bootstrap', text: () => m.skills_getStarted_step1() },
  { id: 'setup-once', text: () => m.skills_getStarted_step2() },
  { id: 'copy-prompt', text: () => m.skills_getStarted_step3() },
] as const

const PIPELINE_STARTERS = [
  { slug: 'setup', invoke: '/setup' },
  { slug: 'align', invoke: '/align' },
  { slug: 'reqs', invoke: '/reqs' },
  { slug: 'to-prd', invoke: '/to-prd' },
  { slug: 'design', invoke: '/design' },
  { slug: 'dev', invoke: '/dev' },
  { slug: 'code-review', invoke: '/code-review' },
] as const

const INVOCATION_CARDS = [
  {
    value: 'user' as const,
    icon: IconCodeSquare,
    label: () => m.catalog_filterUser(),
    desc: () => m.skills_invocation_user_desc(),
  },
  {
    value: 'model' as const,
    icon: IconTuning2,
    label: () => m.catalog_filterModel(),
    desc: () => m.skills_invocation_model_desc(),
  },
]

function SkillsIndexPage() {
  return (
    <div className='px-8 py-10 md:px-10 md:py-12'>
      <div className='mx-auto max-w-3xl'>
        <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 font-bold font-invoke text-primary-600 text-xl'>
          /
        </span>
        <h1 className='mt-5 font-bold font-display text-2xl text-fg'>{m.skills_intro_title()}</h1>
        <p className='mt-2 max-w-2xl text-muted text-sm leading-relaxed'>{m.skills_intro_body()}</p>

        <section className='mt-10'>
          <h2 className='label-mono'>{m.skills_getStarted_stepsTitle()}</h2>
          <ol className='mt-3 list-decimal space-y-2.5 ps-5 text-fg text-sm leading-relaxed'>
            {BOOTSTRAP_STEPS.map(step => (
              <li key={step.id}>{step.text()}</li>
            ))}
          </ol>
          <a
            className='mt-4 inline-block font-medium text-primary-700 text-sm no-underline hover:underline'
            href='/#start'
          >
            {m.skills_getStarted_fullQuickstart()}
          </a>
        </section>

        <section className='mt-10'>
          <h2 className='label-mono'>{m.skills_getStarted_pipelineTitle()}</h2>
          <p className='mt-2 text-muted text-sm leading-relaxed'>{m.skills_getStarted_pipelineHint()}</p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {PIPELINE_STARTERS.map(skill => (
              <RouterLink
                className='rounded-lg border border-line px-3 py-1.5 font-invoke text-primary-700 text-sm no-underline transition-colors hover:bg-surface'
                key={skill.slug}
                params={{ slug: skill.slug }}
                search={mergeSkillsSearch}
                to='/skills/$slug'
              >
                {skill.invoke}
              </RouterLink>
            ))}
          </div>
        </section>

        <section className='mt-10'>
          <h2 className='label-mono'>{m.skills_filterTitle()}</h2>
          <div className='mt-4 grid w-full gap-3 sm:grid-cols-2'>
            {INVOCATION_CARDS.map(card => {
              const Icon = card.icon
              return (
                <RouterLink
                  className='flex flex-col items-start gap-2.5 rounded-2xl border border-line p-4 text-start no-underline transition-colors hover:bg-surface'
                  from='/skills/'
                  key={card.value}
                  search={(prev: SkillsSearch) => mergeSkillsSearch({ ...prev, invocation: card.value })}
                  to='/skills'
                >
                  <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600'>
                    <Icon aria-hidden size={18} />
                  </span>
                  <span className='font-semibold text-fg text-sm'>{card.label()}</span>
                  <span className='text-muted text-xs leading-relaxed'>{card.desc()}</span>
                </RouterLink>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

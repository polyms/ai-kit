import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { IconCodeSquare, IconTuning2 } from '../../lib/icons'
import type { SkillsSearch } from '../../lib/skills-search'
import { mergeSkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/skills/')({
  component: SkillsIndexPage,
})

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
    <div className='flex min-h-full flex-col items-center justify-center px-8 py-16 text-center'>
      <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 font-bold font-invoke text-2xl text-primary-600'>
        /
      </span>
      <h2 className='mt-5 font-bold font-display text-xl'>{m.skills_intro_title()}</h2>
      <p className='mt-2 max-w-md text-muted text-sm leading-relaxed'>{m.skills_intro_body()}</p>

      <div className='mt-10 grid w-full max-w-lg gap-3 sm:grid-cols-2'>
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
    </div>
  )
}

import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { IconBookBookmark, IconCodeSquare, IconDangerTriangle, IconPaletteRound } from '../../lib/icons'
import type { KnowledgeSearch } from '../../lib/knowledge/knowledge.fns'
import type { KnowledgeIntent } from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/knowledge/')({
  component: KnowledgeIndexPage,
})

const INTENT_CARDS = [
  {
    value: 'incident',
    icon: IconDangerTriangle,
    label: () => m.knowledge_intent_incident(),
    desc: () => m.knowledge_intent_incident_desc(),
  },
  {
    value: 'design',
    icon: IconPaletteRound,
    label: () => m.knowledge_intent_design(),
    desc: () => m.knowledge_intent_design_desc(),
  },
  {
    value: 'toolchain',
    icon: IconCodeSquare,
    label: () => m.knowledge_intent_toolchain(),
    desc: () => m.knowledge_intent_toolchain_desc(),
  },
] as const satisfies ReadonlyArray<{
  value: KnowledgeIntent
  icon: typeof IconDangerTriangle
  label: () => string
  desc: () => string
}>

function KnowledgeIndexPage() {
  return (
    <div className='flex min-h-full flex-col items-center justify-center px-8 py-16 text-center'>
      <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600'>
        <IconBookBookmark aria-hidden size={26} />
      </span>
      <h2 className='mt-5 font-bold font-display text-xl'>{m.knowledge_intro_title()}</h2>
      <p className='mt-2 max-w-md text-muted text-sm leading-relaxed'>{m.knowledge_intro_body()}</p>

      <div className='mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-3'>
        {INTENT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <RouterLink
              className='flex flex-col items-start gap-2.5 rounded-2xl border border-line p-4 text-start no-underline transition-colors hover:bg-surface'
              from='/knowledge/'
              key={card.value}
              search={(prev: KnowledgeSearch) => ({ ...prev, intent: card.value })}
              to='/knowledge'
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

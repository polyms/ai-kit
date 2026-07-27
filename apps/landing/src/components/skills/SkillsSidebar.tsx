import { Toggle, ToggleGroup, Toolbar } from '@polyms/ui-kit'
import { Link as RouterLink } from '@tanstack/react-router'
import { IconCodeSquare, IconMagnifier, IconTuning2 } from '../../lib/icons'
import { domainLabel, type ResolvedSkillOverlay } from '../../lib/skills'
import { mergeSkillsSearch, type SkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'
import { PolymsWordmark } from '../PolymsWordmark'
import { SkillsSearchField } from './SkillsUi'

const INVOCATION_TOGGLE_VALUES = ['all', 'user', 'model'] as const

type SkillsSidebarProps = {
  q: string
  invocation: SkillsSearch['invocation']
  skills: ResolvedSkillOverlay[]
  isPending: boolean
  onQueryChange: (q: string) => void
  onInvocationChange: (invocation: SkillsSearch['invocation']) => void
}

function SkillRow({ skill }: { skill: ResolvedSkillOverlay }) {
  const InvocationIcon = skill.invocation === 'user' ? IconCodeSquare : IconTuning2

  return (
    <RouterLink
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-primary-100/60' }}
      className='group flex items-start gap-2.5 rounded-xl px-3 py-2.5 no-underline transition-colors hover:bg-surface'
      from='/skills'
      params={{ slug: skill.slug }}
      search={mergeSkillsSearch}
      to='/skills/$slug'
    >
      {({ isActive }) => (
        <>
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white text-primary-700 transition-[border-style] ${
              isActive
                ? 'border-primary-500 border-solid'
                : 'border-primary-400 border-dashed group-hover:border-solid'
            }`}
          >
            <InvocationIcon aria-hidden size={16} />
          </span>
          <span className='min-w-0 flex-1'>
            <span
              className={`block truncate font-invoke font-semibold text-sm ${isActive ? 'text-primary-700' : 'text-fg'}`}
            >
              {skill.invoke}
            </span>
            <span className='mt-0.5 flex items-center gap-1.5 truncate text-muted text-xs'>
              <span className='truncate'>{skill.name}</span>
              <span aria-hidden>·</span>
              <span className='shrink-0'>{domainLabel(skill.domain)}</span>
            </span>
          </span>
        </>
      )}
    </RouterLink>
  )
}

export function SkillsSidebar({
  q,
  invocation,
  skills,
  isPending,
  onQueryChange,
  onInvocationChange,
}: SkillsSidebarProps) {
  return (
    <aside className='flex h-full w-full shrink-0 flex-col border-line border-e lg:w-88'>
      <div className='shrink-0 px-5 pt-6 pb-1'>
        <h1 className='font-bold font-display text-2xl tracking-tight'>
          <RouterLink
            className='text-fg no-underline hover:text-primary-700'
            search={mergeSkillsSearch}
            to='/skills'
          >
            {m.catalog_title()}
          </RouterLink>
        </h1>
        <p className='mt-1.5 text-muted text-sm leading-relaxed'>{m.catalog_sub()}</p>
      </div>

      <div className='shrink-0 space-y-3 px-5 py-4'>
        <SkillsSearchField onQueryChange={onQueryChange} query={q} />

        <Toolbar
          aria-label={m.catalog_filterUser()}
          className={`w-full transition-opacity ${isPending ? 'opacity-60' : ''}`}
          rounded
          variant='inline'
        >
          <ToggleGroup
            aria-label={m.catalog_filterUser()}
            className='grid w-full grid-cols-3 gap-1'
            onValueChange={values => {
              const next = values[0]
              if (next === 'all' || next === 'user' || next === 'model') {
                onInvocationChange(next)
              }
            }}
            value={[invocation]}
          >
            {INVOCATION_TOGGLE_VALUES.map(value => (
              <Toolbar.Button
                key={value}
                render={<Toggle className='toggle w-full justify-center px-1 text-xs' />}
                value={value}
              >
                {value === 'all'
                  ? m.catalog_filterAll()
                  : value === 'user'
                    ? m.catalog_filterUser()
                    : m.catalog_filterModel()}
              </Toolbar.Button>
            ))}
          </ToggleGroup>
        </Toolbar>
      </div>

      <div className='h-px shrink-0 bg-line' />

      <div
        className={`min-h-0 flex-1 overflow-y-auto px-2 py-2 transition-opacity ${isPending ? 'opacity-60' : ''}`}
      >
        {skills.length === 0 ? (
          <div className='flex flex-col items-center gap-2 px-4 py-10 text-center'>
            <IconMagnifier aria-hidden className='text-muted' size={22} />
            <p className='text-muted text-xs'>{m.catalog_empty()}</p>
          </div>
        ) : (
          <ul aria-label={m.skills_resultsCaption()} className='space-y-0.5'>
            {skills.map(skill => (
              <li key={skill.slug}>
                <SkillRow skill={skill} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='shrink-0 border-line border-t px-5 py-4'>
        <RouterLink className='flex items-center gap-2 no-underline' to='/'>
          <PolymsWordmark
            iconClassName='h-6 w-6 text-slate-500'
            textClassName='font-sans text-[15px] text-fg'
          />
        </RouterLink>
      </div>
    </aside>
  )
}

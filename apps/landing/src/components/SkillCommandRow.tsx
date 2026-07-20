import { domainLabel, type ResolvedSkillOverlay } from '../lib/skills'
import { m } from '../paraglide/messages.js'

type SkillCommandRowProps = {
  skill: ResolvedSkillOverlay
  active?: boolean
  onMouseEnter?: () => void
  onClick?: () => void
  highlight?: string
  id?: string
}

function highlightInvoke(invoke: string, query: string) {
  if (!query.trim()) return invoke
  const q = query.trim().toLowerCase()
  const lower = invoke.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx < 0) return invoke
  return (
    <>
      {invoke.slice(0, idx)}
      <mark className='bg-primary-700/20 text-primary-700'>{invoke.slice(idx, idx + q.length)}</mark>
      {invoke.slice(idx + q.length)}
    </>
  )
}

/** Command-palette listbox option for a skill. */
export function SkillCommandRow({
  skill,
  active,
  onMouseEnter,
  onClick,
  highlight = '',
  id,
}: SkillCommandRowProps) {
  const label = domainLabel(skill.domain)

  return (
    <button
      aria-selected={active ?? false}
      className={`flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors duration-100 sm:flex-row sm:items-center sm:gap-4 ${
        active
          ? 'border-primary-700 border-s-2 bg-primary-700/5'
          : 'border-transparent border-s-2 hover:bg-primary-700/5'
      }`}
      id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role='option'
      tabIndex={active ? 0 : -1}
      type='button'
    >
      <span className='hidden shrink-0 font-invoke text-muted sm:inline'>&gt;</span>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
          <span className='font-bold font-invoke text-lg text-primary-700 md:min-w-28 md:text-xl'>
            {highlightInvoke(skill.invoke, highlight)}
          </span>
          <span className='text-muted text-sm'>{skill.name}</span>
        </div>
        <p className='mt-1 line-clamp-2 text-muted text-sm sm:line-clamp-1'>{skill.description}</p>
        {skill.footnote && <p className='mt-1 text-muted text-xs'>{skill.footnote}</p>}
      </div>
      <div className='flex shrink-0 flex-wrap gap-2 text-xs'>
        <span className='rounded-md border border-line px-2 py-0.5 text-muted'>{label}</span>
        <span className='rounded-md border border-line px-2 py-0.5 text-muted'>
          {skill.invocation === 'user' ? m.catalog_filterUser() : m.catalog_filterModel()}
        </span>
      </div>
    </button>
  )
}

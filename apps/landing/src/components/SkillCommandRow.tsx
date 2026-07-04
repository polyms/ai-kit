import { Link } from '@tanstack/react-router'
import type { SkillOverlay } from '../content/overlay'
import { SkillStatusBadge } from './SkillStatusBadge'
import { useT, type MessageKey } from '../lib/i18n'

type SkillCommandRowProps = {
  skill: SkillOverlay
  active?: boolean
  onMouseEnter?: () => void
  onClick?: () => void
  asButton?: boolean
  highlight?: string
  id?: string
  /** Marks row as a listbox option (command palette). */
  asOption?: boolean
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

export function SkillCommandRow({
  skill,
  active,
  onMouseEnter,
  onClick,
  asButton,
  highlight = '',
  id,
  asOption,
}: SkillCommandRowProps) {
  const t = useT()
  const domainLabel = t(`domain.${skill.domain}` as MessageKey)

  const inner = (
    <>
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
        <span className='rounded-md border border-line px-2 py-0.5 text-muted'>{domainLabel}</span>
        <SkillStatusBadge status={skill.status} />
        <span className='rounded-md border border-line px-2 py-0.5 text-muted'>
          {skill.invocation === 'user' ? t('catalog.filterUser') : t('catalog.filterModel')}
        </span>
      </div>
    </>
  )

  const className = `flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors duration-100 sm:flex-row sm:items-center sm:gap-4 ${
    active
      ? 'border-s-2 border-primary-700 bg-primary-700/5'
      : 'border-s-2 border-transparent hover:bg-primary-700/5'
  }`

  if (asButton && asOption) {
    return (
      <button
        type='button'
        id={id}
        role='option'
        aria-selected={active ?? false}
        tabIndex={active ? 0 : -1}
        className={className}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      >
        {inner}
      </button>
    )
  }

  if (asButton) {
    return (
      <button type='button' id={id} className={className} onMouseEnter={onMouseEnter} onClick={onClick}>
        {inner}
      </button>
    )
  }

  return (
    <Link
      to='/skills/$slug'
      params={{ slug: skill.slug }}
      className={className}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {inner}
    </Link>
  )
}

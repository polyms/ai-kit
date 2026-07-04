import { useEffect, useMemo, useRef, useState } from 'react'
import { Field, Tabs, Toggle, ToggleGroup } from '@polyms/core-ui'
import type { SkillsSearch } from '../lib/skills-search'
import { domainOptions, filterSkills, getSkills } from '../lib/skills'
import { useT, type MessageKey } from '../lib/i18n'
import { IconMagnifier } from '../lib/icons'
import { SkillCommandRow } from './SkillCommandRow'

type SkillCommandListProps = {
  search: SkillsSearch
  onSearchChange: (next: Partial<SkillsSearch>) => void
}

export function SkillCommandList({ search, onSearchChange }: SkillCommandListProps) {
  const t = useT()
  const [debouncedQ, setDebouncedQ] = useState(search.q)
  const [activeIndex, setActiveIndex] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQ(search.q), 150)
    return () => window.clearTimeout(id)
  }, [search.q])

  const skills = useMemo(
    () =>
      filterSkills(getSkills(), {
        search: debouncedQ,
        domain: search.domain === 'all' ? undefined : search.domain,
        invocation: search.invocation,
      }),
    [debouncedQ, search.domain, search.invocation]
  )

  useEffect(() => {
    setActiveIndex(0)
  }, [debouncedQ, search.domain, search.invocation])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (document.activeElement !== searchRef.current) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, skills.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [skills.length])

  const domainChips = ['all', ...domainOptions.filter(d => d !== 'all')] as const

  return (
    <div className='space-y-5'>
      <div className='relative'>
        <Field>
          <Field.Control
            ref={searchRef}
            type='search'
            value={search.q}
            onChange={e => onSearchChange({ q: e.target.value })}
            placeholder={t('catalog.search')}
            className='min-h-11 ps-10 font-invoke'
          />
        </Field>
        <IconMagnifier
          size={18}
          aria-hidden
          className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted'
        />
      </div>

      <ToggleGroup
        aria-label={t('catalog.filterAll')}
        className='toggle-group flex gap-2 overflow-x-auto pb-1'
        value={[search.domain]}
        onValueChange={values => {
          const next = values[0]
          if (next) onSearchChange({ domain: next as SkillsSearch['domain'] })
        }}
      >
        {domainChips.map(d => (
          <Toggle key={d} className='toggle min-h-11 shrink-0 px-3 text-sm' value={d}>
            {d === 'all' ? t('catalog.filterAll') : t(`domain.${d}` as MessageKey)}
          </Toggle>
        ))}
      </ToggleGroup>

      <Tabs
        value={search.invocation}
        onValueChange={v => onSearchChange({ invocation: v as SkillsSearch['invocation'] })}
      >
        <Tabs.List className='mb-0'>
          <Tabs.Tab value='all'>{t('catalog.filterAll')}</Tabs.Tab>
          <Tabs.Tab value='user'>{t('catalog.filterUser')}</Tabs.Tab>
          <Tabs.Tab value='model'>{t('catalog.filterModel')}</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {skills.length === 0 ? (
        <div className='border border-line border-dashed py-16 text-center'>
          <p className='font-invoke text-muted'>&gt; 0 results</p>
          <p className='mt-2 text-muted text-sm'>{t('catalog.empty')}</p>
          <button
            type='button'
            onClick={() => onSearchChange({ q: '', domain: 'all', invocation: 'all' })}
            className='mt-4 text-primary-700 text-sm hover:underline'
          >
            {t('catalog.clear')}
          </button>
        </div>
      ) : (
        <ul className='divide-y divide-line rounded-lg border border-line'>
          {skills.map((skill, i) => (
            <li key={skill.slug}>
              <SkillCommandRow
                skill={skill}
                active={i === activeIndex}
                highlight={debouncedQ}
                onMouseEnter={() => setActiveIndex(i)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { Field, Tabs, Toggle, ToggleGroup } from '@polyms/core-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconMagnifier } from '../lib/icons'
import { m } from '../paraglide/messages.js'
import { domainLabel, domainOptions, filterSkills, getSkills } from '../lib/skills'
import type { SkillsSearch } from '../lib/skills-search'
import { SkillCommandRow } from './SkillCommandRow'

type SkillCommandListProps = {
  search: SkillsSearch
  onSearchChange: (next: Partial<SkillsSearch>) => void
}

export function SkillCommandList({ search, onSearchChange }: SkillCommandListProps) {
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
            className='min-h-11 ps-10 font-invoke'
            onChange={e => onSearchChange({ q: e.target.value })}
            placeholder={m.catalog_search()}
            ref={searchRef}
            type='search'
            value={search.q}
          />
        </Field>
        <IconMagnifier
          aria-hidden
          className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted'
          size={18}
        />
      </div>

      <ToggleGroup
        aria-label={m.catalog_filterAll()}
        className='toggle-group flex gap-2 overflow-x-auto pb-1'
        onValueChange={values => {
          const next = values[0]
          if (next) onSearchChange({ domain: next as SkillsSearch['domain'] })
        }}
        value={[search.domain]}
      >
        {domainChips.map(d => (
          <Toggle className='toggle min-h-11 shrink-0 px-3 text-sm' key={d} value={d}>
            {d === 'all' ? m.catalog_filterAll() : domainLabel(d)}
          </Toggle>
        ))}
      </ToggleGroup>

      <Tabs
        onValueChange={v => onSearchChange({ invocation: v as SkillsSearch['invocation'] })}
        value={search.invocation}
      >
        <Tabs.List className='mb-0'>
          <Tabs.Tab value='all'>{m.catalog_filterAll()}</Tabs.Tab>
          <Tabs.Tab value='user'>{m.catalog_filterUser()}</Tabs.Tab>
          <Tabs.Tab value='model'>{m.catalog_filterModel()}</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {skills.length === 0 ? (
        <div className='border border-line border-dashed py-16 text-center'>
          <p className='font-invoke text-muted'>&gt; 0 results</p>
          <p className='mt-2 text-muted text-sm'>{m.catalog_empty()}</p>
          <button
            className='mt-4 text-primary-700 text-sm hover:underline'
            onClick={() => onSearchChange({ q: '', domain: 'all', invocation: 'all' })}
            type='button'
          >
            {m.catalog_clear()}
          </button>
        </div>
      ) : (
        <ul className='divide-y divide-line rounded-lg border border-line'>
          {skills.map((skill, i) => (
            <li key={skill.slug}>
              <SkillCommandRow
                active={i === activeIndex}
                highlight={debouncedQ}
                onMouseEnter={() => setActiveIndex(i)}
                skill={skill}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { Field, Modal } from '@polyms/core-ui'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconMagnifier } from '../lib/icons'
import { getSkills } from '../lib/skills'
import { defaultSkillsSearch } from '../lib/skills-search'
import { trackEvent } from '../lib/umami'
import { m } from '../paraglide/messages.js'
import { useAppStore } from '../stores/useAppStore'
import { SkillCommandRow } from './SkillCommandRow'

function isPaletteHidden(pathname: string) {
  return (
    pathname.startsWith('/knowledge') || pathname.startsWith('/ops') || pathname.startsWith('/skills')
  )
}

export function CommandPalette() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const hidden = isPaletteHidden(pathname)
  const open = useAppStore(s => s.paletteOpen)
  const setPaletteOpen = useAppStore(s => s.setPaletteOpen)
  const togglePalette = useAppStore(s => s.togglePalette)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const locale = useAppStore(s => s.locale)
  const skills = getSkills(locale)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return skills
    return skills.filter(s => [s.invoke, s.name, s.description].join(' ').toLowerCase().includes(q))
  }, [query, skills])

  useEffect(() => {
    if (hidden) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.code !== 'KeyK') return

      e.preventDefault()
      e.stopPropagation()
      togglePalette()
    }

    document.addEventListener('keydown', onKeyDown, { capture: true })
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [hidden, togglePalette])

  useEffect(() => {
    if (hidden && open) setPaletteOpen(false)
  }, [hidden, open, setPaletteOpen])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const goToSkill = (slug: string) => {
    setPaletteOpen(false)
    navigate({ to: '/skills/$slug', params: { slug }, search: defaultSkillsSearch })
  }

  const handleOpenChange = (next: boolean) => {
    if (next) {
      trackEvent('command_palette_open', { source: 'palette' })
    }
    setPaletteOpen(next)
  }

  const listboxId = 'command-palette-listbox'
  const activeOptionId = filtered[activeIndex]
    ? `command-palette-option-${filtered[activeIndex].slug}`
    : undefined

  if (hidden) {
    return null
  }

  return (
    <Modal onOpenChange={handleOpenChange} open={open}>
      <Modal.Content size='lg'>
        <div className='relative border-line border-b'>
          <Field size='2xl'>
            <IconMagnifier aria-hidden className='icon-start' />
            <Field.Control
              aria-activedescendant={activeOptionId}
              aria-autocomplete='list'
              aria-controls={listboxId}
              aria-label={m.palette_title()}
              className='rounded-none border-0 bg-transparent text-sm shadow-none outline-0 ring-0'
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setActiveIndex(i => Math.max(i - 1, 0))
                }
                if (e.key === 'Enter' && filtered[activeIndex]) {
                  goToSkill(filtered[activeIndex].slug)
                }
              }}
              placeholder={m.palette_placeholder()}
              ref={inputRef}
              type='search'
              value={query}
            />
          </Field>
        </div>
        <div
          aria-label={m.palette_title()}
          className='max-h-80 overflow-y-auto'
          id={listboxId}
          role='listbox'
        >
          {filtered.map((skill, i) => (
            <SkillCommandRow
              active={i === activeIndex}
              highlight={query}
              id={`command-palette-option-${skill.slug}`}
              key={skill.slug}
              onClick={() => goToSkill(skill.slug)}
              onMouseEnter={() => setActiveIndex(i)}
              skill={skill}
            />
          ))}
          {filtered.length === 0 && (
            <div className='px-4 py-8 text-center'>
              <p className='font-invoke text-muted'>&gt; {m.catalog_zeroResults()}</p>
              <p className='mt-2 text-muted text-sm'>{m.catalog_empty()}</p>
            </div>
          )}
        </div>
        <p className='border-line border-t px-4 py-2 font-invoke text-muted text-xs'>{m.palette_hint()}</p>
      </Modal.Content>
    </Modal>
  )
}

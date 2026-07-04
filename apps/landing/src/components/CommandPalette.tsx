import { Field, Modal } from '@polyms/core-ui'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconMagnifier } from '../lib/icons'
import { m } from '../paraglide/messages.js'
import { getSkills } from '../lib/skills'
import { trackEvent } from '../lib/umami'
import { useAppStore } from '../stores/useAppStore'
import { SkillCommandRow } from './SkillCommandRow'

export function CommandPalette() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const open = useAppStore(s => s.paletteOpen)
  const setPaletteOpen = useAppStore(s => s.setPaletteOpen)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const skills = getSkills()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return skills
    return skills.filter(s => [s.invoke, s.name, s.description].join(' ').toLowerCase().includes(q))
  }, [query, skills])

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
    navigate({ to: '/skills/$slug', params: { slug } })
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

  if (pathname.startsWith('/runbooks') || pathname.startsWith('/ops')) {
    return null
  }

  return (
    <Modal onOpenChange={handleOpenChange} open={open}>
      <Modal.Content className='max-w-2xl overflow-hidden p-0' size='lg'>
        <div className='relative border-line border-b'>
          <Field>
            <Field.Control
              aria-activedescendant={activeOptionId}
              aria-autocomplete='list'
              aria-controls={listboxId}
              aria-label={m.palette_title()}
              className='rounded-none border-0 bg-transparent py-3 ps-10 pe-4 font-invoke text-sm shadow-none'
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
          <IconMagnifier
            aria-hidden
            className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted'
            size={18}
          />
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
              asButton
              asOption
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
              <p className='font-invoke text-muted'>&gt; 0 results</p>
              <p className='mt-2 text-muted text-sm'>{m.catalog_empty()}</p>
            </div>
          )}
        </div>
        <p className='border-line border-t px-4 py-2 font-invoke text-muted text-xs'>{m.palette_hint()}</p>
      </Modal.Content>
    </Modal>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Field, Modal } from '@polyms/core-ui'
import { getSkills } from '../lib/skills'
import { useAppStore } from '../stores/useAppStore'
import { useT } from '../lib/i18n'
import { trackEvent } from '../lib/umami'
import { IconMagnifier } from '../lib/icons'
import { SkillCommandRow } from './SkillCommandRow'

export function CommandPalette() {
  const open = useAppStore(s => s.paletteOpen)
  const setPaletteOpen = useAppStore(s => s.setPaletteOpen)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const t = useT()
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

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Content size='lg' className='max-w-2xl overflow-hidden p-0'>
        <div className='relative border-line border-b'>
          <Field>
            <Field.Control
              ref={inputRef}
              type='search'
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('palette.placeholder')}
              aria-label={t('palette.title')}
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              aria-autocomplete='list'
              className='rounded-none border-0 bg-transparent py-3 ps-10 pe-4 font-invoke text-sm shadow-none'
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
            />
          </Field>
          <IconMagnifier
            size={18}
            aria-hidden
            className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted'
          />
        </div>
        <div
          id={listboxId}
          role='listbox'
          className='max-h-80 overflow-y-auto'
          aria-label={t('palette.title')}
        >
          {filtered.map((skill, i) => (
            <SkillCommandRow
              key={skill.slug}
              id={`command-palette-option-${skill.slug}`}
              skill={skill}
              active={i === activeIndex}
              asButton
              asOption
              highlight={query}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => goToSkill(skill.slug)}
            />
          ))}
          {filtered.length === 0 && (
            <div className='px-4 py-8 text-center'>
              <p className='font-invoke text-muted'>&gt; 0 results</p>
              <p className='mt-2 text-muted text-sm'>{t('catalog.empty')}</p>
            </div>
          )}
        </div>
        <p className='border-line border-t px-4 py-2 font-invoke text-muted text-xs'>{t('palette.hint')}</p>
      </Modal.Content>
    </Modal>
  )
}

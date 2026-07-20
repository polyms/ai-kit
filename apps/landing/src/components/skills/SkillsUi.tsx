import { Field } from '@polyms/core-ui'
import { useEffect, useRef, useState } from 'react'
import { IconMagnifier } from '../../lib/icons'
import { m } from '../../paraglide/messages.js'

type SkillsSearchFieldProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function SkillsSearchField({ query, onQueryChange }: SkillsSearchFieldProps) {
  const [value, setValue] = useState(query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setValue(query)
  }, [query])

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  return (
    <div className='relative'>
      <Field className='w-full' name='skills-search'>
        <Field.Label className='sr-only'>{m.skills_searchLabel()}</Field.Label>
        <Field.Control
          aria-label={m.skills_searchLabel()}
          autoComplete='off'
          className='min-h-11 rounded-full border-none bg-surface ps-10 font-invoke text-sm shadow-none'
          onChange={e => {
            const next = e.target.value
            setValue(next)
            clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => onQueryChange(next), 300)
          }}
          placeholder={m.catalog_search()}
          type='search'
          value={value}
        />
      </Field>
      <IconMagnifier
        aria-hidden
        className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted'
        size={18}
      />
    </div>
  )
}

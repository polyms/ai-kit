import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { skillOverlays } from '../content/overlay'

const skillSlugSet = new Set(skillOverlays.map(s => s.slug))

/** Matches `/skill` or backtick-wrapped `` `/skill` `` */
const INVOKE_RE = /`(\/[a-z][a-z0-9-]*)`|(\/[a-z][a-z0-9-]*)/g

function SkillInvokeBadge({ invoke, slug }: { invoke: string; slug: string }) {
  return (
    <Link
      to='/skills/$slug'
      params={{ slug }}
      className='inline align-baseline no-underline hover:opacity-90'
    >
      <span className='badge badge-info font-invoke text-xs'>{invoke}</span>
    </Link>
  )
}

export function SkillInvokeText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(INVOKE_RE)) {
    const invoke = match[1] ?? match[2]
    if (!invoke) continue

    const slug = invoke.slice(1)
    const start = match.index ?? 0

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }

    if (skillSlugSet.has(slug)) {
      parts.push(<SkillInvokeBadge key={`${start}-${invoke}`} invoke={invoke} slug={slug} />)
    } else {
      parts.push(match[0])
    }

    lastIndex = start + match[0].length
  }

  if (parts.length === 0) {
    return <>{text}</>
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

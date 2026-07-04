import type { SkillStatus } from '../content/overlay'
import { m } from '../paraglide/messages.js'

type SkillStatusBadgeProps = {
  status: SkillStatus
}

export function SkillStatusBadge({ status }: SkillStatusBadgeProps) {
  const label = status === 'planned' ? m.catalog_status_planned() : m.catalog_status_available()
  const className = status === 'planned' ? 'badge-status-planned' : 'badge-status-available'

  return <span className={className}>{label}</span>
}

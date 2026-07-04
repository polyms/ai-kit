import type { SkillStatus } from '../content/overlay'
import { useT } from '../lib/i18n'

type SkillStatusBadgeProps = {
  status: SkillStatus
}

export function SkillStatusBadge({ status }: SkillStatusBadgeProps) {
  const t = useT()
  const label = status === 'planned' ? t('catalog.status.planned') : t('catalog.status.available')
  const className = status === 'planned' ? 'badge-status-planned' : 'badge-status-available'

  return <span className={className}>{label}</span>
}

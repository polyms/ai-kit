import type { ReactNode } from 'react'

type SkillDetailSectionProps = {
  label: string
  children: ReactNode
}

export function SkillDetailSection({ label, children }: SkillDetailSectionProps) {
  return (
    <section className='skill-detail-section'>
      <p className='skill-detail-section__label'>{label}</p>
      <div className='skill-detail-section__body'>{children}</div>
    </section>
  )
}

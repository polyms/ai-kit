import { Link } from '@tanstack/react-router'
import { skillOverlays } from '../../content/overlay'
import { defaultSkillsSearch } from '../../lib/skills-search'
import { SkillStatusBadge } from '../SkillStatusBadge'
import { useT, type MessageKey } from '../../lib/i18n'
import { SkillIcon } from '../../lib/skill-icons'

export function HomeCatalog() {
  const t = useT()

  return (
    <section id='catalog' className='demo-shell mx-auto max-w-[1080px] px-10 pt-2.5 pb-[110px]'>
      <div className='mb-2 flex items-baseline gap-3.5'>
        <h2 className='m-0 font-bold font-sans text-[34px] leading-[1.1] tracking-tight'>
          {t('catalog.title')}
        </h2>
        <span className='h-px flex-1 bg-line' aria-hidden />
      </div>
      <p className='mb-7 text-muted'>{t('home.catalog.intro')}</p>
      <div className='demo-catalog-grid'>
        {skillOverlays.map(skill => {
          const domainLabel = t(`domain.${skill.domain}` as MessageKey)
          return (
            <Link
              key={skill.slug}
              to='/skills/$slug'
              params={{ slug: skill.slug }}
              className='demo-catalog-card card flex items-start gap-3.5 px-[18px] py-4 no-underline transition-colors duration-200 hover:bg-surface-2/50 focus-visible:outline-2 focus-visible:outline-primary-700'
            >
              <span className='demo-catalog-card__icon flex size-10 shrink-0 items-center justify-center rounded-[10px]'>
                <SkillIcon slug={skill.slug} />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='mb-0.5 flex flex-wrap items-center gap-2'>
                  <span className='font-bold font-mono text-[var(--brand-accent)] text-sm'>
                    {skill.invoke}
                  </span>
                  <SkillStatusBadge status={skill.status} />
                </span>
                <span className='mb-0.5 block font-semibold text-[13px] text-fg'>{skill.name}</span>
                <span className='line-clamp-2 block text-[13px] text-muted leading-normal'>
                  {skill.description}
                </span>
                <span className='mt-1 block text-[11px] text-muted'>{domainLabel}</span>
              </span>
            </Link>
          )
        })}
      </div>
      <p className='mt-8'>
        <Link
          to='/skills'
          search={defaultSkillsSearch}
          className='font-invoke text-primary-700 text-sm hover:underline'
        >
          {t('catalog.viewAll')} →
        </Link>
      </p>
    </section>
  )
}

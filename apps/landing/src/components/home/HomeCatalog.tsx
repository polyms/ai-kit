import { Link } from '@tanstack/react-router'
import { skillOverlays } from '../../content/overlay'
import { SkillIcon } from '../../lib/skill-icons'
import { domainLabel } from '../../lib/skills'
import { defaultSkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'
import { SkillStatusBadge } from '../SkillStatusBadge'

export function HomeCatalog() {
  return (
    <section className='app-shell mx-auto max-w-[1080px] px-10 pt-2.5 pb-[110px]' id='catalog'>
      <div className='mb-2 flex items-baseline gap-3.5'>
        <h2 className='m-0 font-bold font-sans text-[34px] leading-[1.1] tracking-tight'>
          {m.catalog_title()}
        </h2>
        <span aria-hidden className='h-px flex-1 bg-line' />
      </div>
      <p className='mb-7 text-muted'>{m.home_catalog_intro()}</p>
      <div className='app-catalog-grid'>
        {skillOverlays.map(skill => {
          const label = domainLabel(skill.domain)
          return (
            <Link
              className='app-catalog-card card flex items-start gap-3.5 px-[18px] py-4 no-underline transition-colors duration-200 hover:bg-surface-2/50 focus-visible:outline-2 focus-visible:outline-primary-700'
              key={skill.slug}
              params={{ slug: skill.slug }}
              to='/skills/$slug'
            >
              <span className='app-catalog-card__icon flex size-10 shrink-0 items-center justify-center rounded-[10px]'>
                <SkillIcon slug={skill.slug} />
              </span>
              <span className='min-w-0 flex-1'>
                <span className='mb-0.5 flex flex-wrap items-center gap-2'>
                  <span className='font-bold font-mono text-(--brand-accent) text-sm'>{skill.invoke}</span>
                  <SkillStatusBadge status={skill.status} />
                </span>
                <span className='mb-0.5 block font-semibold text-[13px] text-fg'>{skill.name}</span>
                <span className='line-clamp-2 block text-[13px] text-muted leading-normal'>
                  {skill.description}
                </span>
                <span className='mt-1 block text-[11px] text-muted'>{label}</span>
              </span>
            </Link>
          )
        })}
      </div>
      <p className='mt-8'>
        <Link
          className='font-invoke text-primary-700 text-sm hover:underline'
          search={defaultSkillsSearch}
          to='/skills'
        >
          {m.catalog_viewAll()} →
        </Link>
      </p>
    </section>
  )
}

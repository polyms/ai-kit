import { Link } from '@tanstack/react-router'
import { SkillIcon } from '../../lib/skill-icons'
import { getSkills } from '../../lib/skills'
import { m } from '../../paraglide/messages.js'
import { useAppStore } from '../../stores/useAppStore'
import { HOME_PLAYFUL } from './brand'
import { catalogCategory, catalogDisplayName } from './catalogCategory'
import { HomeSectionChip } from './HomeSectionChip'

/** Order + membership aligned with ui_kits/ai-kit-landing/Catalog.jsx */
const HOME_CATALOG_SLUGS = [
  'setup',
  'align',
  'reqs',
  'to-prd',
  'to-issues',
  'triage',
  'design',
  'dev',
  'code-review',
  'docs',
  'e2e',
  'craft',
  'arch-refactor',
  'arch',
  'devops',
] as const

export function HomeCatalog() {
  const locale = useAppStore(s => s.locale)
  const skills = getSkills(locale)
  const homeCatalogSkills = HOME_CATALOG_SLUGS.map(slug => skills.find(s => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => s != null
  )

  return (
    <section
      className='app-home-section app-home-section--catalog app-shell mx-auto max-w-[1080px]'
      id='catalog'
    >
      <HomeSectionChip label={m.chip_catalog()} n='03' />
      <div className='mb-3 flex items-baseline gap-3.5'>
        <h2 className='app-catalog__title m-0 font-bold font-sans tracking-tight'>
          {m.home_catalog_heading()}
        </h2>
        <span aria-hidden className='h-px flex-1 bg-line' />
      </div>
      <p className='mb-8 text-muted'>{m.home_catalog_intro()}</p>
      <div className='app-catalog-grid'>
        {homeCatalogSkills.map((skill, i) => {
          const featured = i === 0
          const playfulRotate =
            HOME_PLAYFUL && i % 2 === 0 ? '-rotate-[0.3deg]' : HOME_PLAYFUL ? 'rotate-[0.3deg]' : ''
          return (
            <Link
              className={`app-catalog-card flex flex-col rounded-[24px] border p-7 no-underline transition-transform duration-300 ease-in-out hover:opacity-95 ${featured ? 'app-catalog-card--featured' : 'border-line bg-body'} ${playfulRotate}`}
              key={skill.slug}
              params={{ slug: skill.slug }}
              to='/skills/$slug'
            >
              <div className='mb-5 flex items-center justify-between'>
                <span className='app-catalog-card__icon flex size-11 items-center justify-center rounded-full'>
                  <SkillIcon slug={skill.slug} />
                </span>
                <span className='rounded-full border border-line px-3 py-1 font-bold font-mono text-[11px] text-muted tracking-wider'>
                  {catalogCategory(skill.slug)}
                </span>
              </div>
              <div className='mb-1.5 font-bold font-mono text-[19px] text-primary-600'>{skill.invoke}</div>
              <div className='mb-2.5 font-bold font-sans text-[18px] text-fg'>
                {catalogDisplayName(skill.slug, skill.name)}
              </div>
              <div className='text-[14.5px] text-muted leading-relaxed'>{skill.description}</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

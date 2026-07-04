import { useT } from '../../lib/i18n'
import { SkillIcon } from '../../lib/skill-icons'
import { DEMO_CATALOG_ITEMS } from './demo-catalog'

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
        {DEMO_CATALOG_ITEMS.map(skill => (
          <div
            key={skill.invoke}
            className='demo-catalog-card card flex cursor-default items-start gap-3.5 px-[18px] py-4 no-underline transition-colors duration-200'
          >
            <span className='demo-catalog-card__icon flex size-10 shrink-0 items-center justify-center rounded-[10px]'>
              <SkillIcon slug={skill.invoke.slice(1)} />
            </span>
            <span className='min-w-0 flex-1'>
              <span className='mb-0.5 flex flex-wrap items-center gap-2'>
                <span className='font-bold font-mono text-[var(--brand-accent)] text-sm'>{skill.invoke}</span>
                <span className={skill.status === 'available' ? 'badge badge-success' : 'badge badge-light'}>
                  {skill.status === 'available' ? t('catalog.status.available') : t('catalog.status.planned')}
                </span>
              </span>
              <span className='mb-0.5 block font-semibold text-[13px] text-fg'>{skill.name}</span>
              <span className='block text-[13px] text-muted leading-normal'>{skill.domain}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

import { useEffect } from 'react'
import { Button } from '@polyms/core-ui'
import { GITHUB_REPO } from '../../content/overlay'
import { useT } from '../../lib/i18n'
import { injectUmami } from '../../lib/umami'
import { ChatRoundDots, Code2, DocumentText } from '@solar-icons/react-perf/BoldDuotone'
import { Code2BoldDuotone } from '@solar-icons/react-perf'

const PIPELINE_LINKS = ['/align', '/pm', '/to-prd', '/to-issues', '/dev', '/code-review'] as const

export function HomeFooter() {
  const t = useT()

  useEffect(() => {
    injectUmami()
  }, [])

  return (
    <footer className='demo-shell relative mx-5 mb-5 overflow-hidden rounded-[28px] bg-slate-900 text-[#eceff4]'>
      <div className='demo-footer__glow pointer-events-none absolute inset-0' aria-hidden />
      <div className='relative flex flex-wrap gap-[60px] px-11 pt-14 pb-8'>
        <div className='min-w-[260px] flex-[1_1_280px]'>
          <div className='mb-3.5 flex items-center gap-2.5'>
            <img src='/favicon.svg' alt='' width={30} height={30} />
            <span className='font-bold font-sans text-[22px]'>Polyms</span>
          </div>
          <p className='mb-5 max-w-sm font-semibold text-body'>{t('footer.blurb')}</p>
          <Button
            variant='primary'
            size='sm'
            rounded
            render={<a href={GITHUB_REPO} target='_blank' rel='noopener noreferrer' />}
          >
            <Code2BoldDuotone className='size-4' />
            {t('footer.starGithub')}
          </Button>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {t('footer.col.pipeline')}
          </div>
          <div className='flex flex-col gap-1'>
            {PIPELINE_LINKS.map(slug => (
              <a key={slug} href={`#${slug}`} className='link font-medium no-underline'>
                {slug}
              </a>
            ))}
          </div>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {t('footer.col.resources')}
          </div>
          <div className='flex flex-col gap-2.5'>
            <a href='#docs' className='link font-medium no-underline'>
              {t('nav.docs')}
            </a>
            <a href='/runbooks' className='link font-medium no-underline'>
              {t('nav.runbooks')}
            </a>
            <a href='#catalog' className='link font-medium no-underline'>
              {t('footer.link.catalog')}
            </a>
            <a href='https://ui.polyms.dev' className='link font-medium no-underline'>
              Polyms UI
            </a>
          </div>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {t('footer.col.community')}
          </div>
          <div className='flex flex-col gap-2.5'>
            <a
              href={GITHUB_REPO}
              target='_blank'
              rel='noopener noreferrer'
              className='link font-medium no-underline'
            >
              GitHub
            </a>
            <a
              href={`${GITHUB_REPO}/issues`}
              target='_blank'
              rel='noopener noreferrer'
              className='link font-medium no-underline'
            >
              {t('footer.link.issues')}
            </a>
            <a
              href={`${GITHUB_REPO}/discussions`}
              target='_blank'
              rel='noopener noreferrer'
              className='link font-medium no-underline'
            >
              {t('footer.link.discussions')}
            </a>
          </div>
        </div>
      </div>

      <div className='relative flex flex-wrap items-center justify-between gap-4 border-[color-mix(in_oklab,#fff_10%,transparent)] border-t px-11 py-[18px] text-[#7d8290] text-[13px]'>
        <span>{t('footer.copyright')}</span>
        <div className='flex gap-3.5'>
          <Code2 size={18} color='#dfe3ea' aria-hidden />
          <ChatRoundDots size={18} color='#dfe3ea' aria-hidden />
          <DocumentText size={18} color='#dfe3ea' aria-hidden />
        </div>
      </div>
    </footer>
  )
}

import { Button } from '@polyms/core-ui'
import { Code2BoldDuotone } from '@solar-icons/react-perf'
import { ChatRoundDots, Code2, DocumentText } from '@solar-icons/react-perf/BoldDuotone'
import { useEffect } from 'react'
import { GITHUB_REPO } from '../../content/overlay'
import { injectUmami } from '../../lib/umami'
import { m } from '../../paraglide/messages.js'
import { PolymsWordmark } from '../PolymsWordmark'

const PIPELINE_LINKS = ['/align', '/pm', '/to-prd', '/to-issues', '/dev', '/code-review'] as const

export function HomeFooter() {
  useEffect(() => {
    injectUmami()
  }, [])

  return (
    <footer className='app-shell relative mx-5 mb-5 overflow-hidden rounded-[28px] bg-slate-900 text-[#eceff4]'>
      <div aria-hidden className='app-footer__glow pointer-events-none absolute inset-0' />
      <div className='relative flex flex-wrap gap-[60px] px-11 pt-14 pb-8'>
        <div className='min-w-[260px] flex-[1_1_280px]'>
          <div className='mb-3.5'>
            <PolymsWordmark iconClassName='text-white' size='footer' textClassName='font-sans' />
          </div>
          <p className='mb-5 max-w-sm font-semibold text-body'>{m.footer_blurb()}</p>
          <Button
            render={<a href={GITHUB_REPO} rel='noopener noreferrer' target='_blank' />}
            rounded
            size='sm'
            variant='primary'
          >
            <Code2BoldDuotone className='size-4' />
            {m.footer_starGithub()}
          </Button>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {m.footer_col_pipeline()}
          </div>
          <div className='flex flex-col gap-1'>
            {PIPELINE_LINKS.map(slug => (
              <a className='link font-medium no-underline' href={`#${slug}`} key={slug}>
                {slug}
              </a>
            ))}
          </div>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {m.footer_col_resources()}
          </div>
          <div className='flex flex-col gap-2.5'>
            <a className='link font-medium no-underline' href='#docs'>
              {m.nav_docs()}
            </a>
            <a className='link font-medium no-underline' href='/runbooks'>
              {m.nav_runbooks()}
            </a>
            <a className='link font-medium no-underline' href='#catalog'>
              {m.footer_link_catalog()}
            </a>
            <a className='link font-medium no-underline' href='https://ui.polyms.dev'>
              Polyms UI
            </a>
          </div>
        </div>

        <div className='min-w-[140px]'>
          <div className='mb-3.5 font-mono font-normal text-[#7d8290] text-[11px] uppercase tracking-[0.08em]'>
            {m.footer_col_community()}
          </div>
          <div className='flex flex-col gap-2.5'>
            <a
              className='link font-medium no-underline'
              href={GITHUB_REPO}
              rel='noopener noreferrer'
              target='_blank'
            >
              GitHub
            </a>
            <a
              className='link font-medium no-underline'
              href={`${GITHUB_REPO}/issues`}
              rel='noopener noreferrer'
              target='_blank'
            >
              {m.footer_link_issues()}
            </a>
            <a
              className='link font-medium no-underline'
              href={`${GITHUB_REPO}/discussions`}
              rel='noopener noreferrer'
              target='_blank'
            >
              {m.footer_link_discussions()}
            </a>
          </div>
        </div>
      </div>

      <div className='relative flex flex-wrap items-center justify-between gap-4 border-[color-mix(in_oklab,#fff_10%,transparent)] border-t px-11 py-[18px] text-[#7d8290] text-[13px]'>
        <span>{m.footer_copyright()}</span>
        <div className='flex gap-3.5'>
          <Code2 aria-hidden color='#dfe3ea' size={18} />
          <ChatRoundDots aria-hidden color='#dfe3ea' size={18} />
          <DocumentText aria-hidden color='#dfe3ea' size={18} />
        </div>
      </div>
    </footer>
  )
}

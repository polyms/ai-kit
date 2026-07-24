import { Button } from '@polyms/ui-kit'
import { CodeSquare, Programming } from '@solar-icons/react-perf/BoldDuotone'
import { Fragment } from 'react'
import { GITHUB_REPO } from '../../content/overlay'
import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'
import { HomeSectionChip } from './HomeSectionChip'

const REPO = 'git@github.com:polyms/ai-kit.git'
const PATH = '~/src/ai-kit'

function renderTerminalLine(text: string, isComment: boolean) {
  if (isComment) {
    return <span className='app-terminal__dim'>{text}</span>
  }

  const segments = text.split(REPO).flatMap((chunk, idx, arr) => {
    const withRepo = idx < arr.length - 1 ? [chunk, { repo: true as const }] : [chunk]
    return withRepo
  })

  return (
    <>
      {segments.map(seg => {
        if (typeof seg !== 'string') {
          return (
            <span className='app-terminal__repo' key={`repo-${seg}`}>
              {REPO}
            </span>
          )
        }
        const parts = seg.split(PATH)
        return (
          <Fragment key={`chunk-${seg}`}>
            {parts.map((part, k) => (
              <Fragment key={part}>
                <span className='app-terminal__prompt'>{part}</span>
                {k < parts.length - 1 ? <span className='app-terminal__text'>{PATH}</span> : null}
              </Fragment>
            ))}
          </Fragment>
        )
      })}
    </>
  )
}

export function HomeQuickStart() {
  const lines = [
    { prefix: '$', text: `git clone ${REPO} ${PATH}` },
    { prefix: '$', text: `cd ${PATH}` },
    { prefix: '$', text: 'pnpm bootstrap' },
    { prefix: '#', text: m.quickstart_terminalComment() },
  ] as const

  return (
    <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='start'>
      <HomeSectionChip label={m.chip_quickstart()} n='04' />
      <div className='flex flex-wrap items-center gap-14'>
        <div className='min-w-[280px] max-w-[460px] flex-[1_1_380px]'>
          <h2 className='app-install__title m-0 mb-5 font-bold font-sans text-fg'>
            {m.quickstart_titlePrefix()} <span className='font-mono text-primary-600'>/align</span>.
          </h2>
          <p className='m-0 mb-7 text-[17px] text-muted leading-relaxed'>{m.quickstart_body()}</p>
          <Button
            render={<a href={GITHUB_REPO} rel='noopener noreferrer' target='_blank' />}
            rounded
            size='xl'
            variant='primary'
          >
            <CodeSquare aria-hidden color='#ffffff' size={18} />
            polyms/ai-kit ↗
          </Button>
        </div>

        <div
          className={`app-terminal relative min-w-[300px] max-w-[480px] flex-[1_1_380px] overflow-hidden rounded-[22px] ${HOME_PLAYFUL ? '-rotate-[0.6deg]' : ''}`}
        >
          <Programming
            aria-hidden
            className='app-terminal__watermark pointer-events-none absolute -top-2.5 right-6 text-primary-600 opacity-35'
            size={80}
          />
          <div className='app-terminal__bar flex items-center gap-2 px-[18px] py-3'>
            <span className='size-2.5 shrink-0 rounded-full bg-[#f43f5e]' />
            <span className='size-2.5 shrink-0 rounded-full bg-[#f59e0b]' />
            <span className='size-2.5 shrink-0 rounded-full bg-[#10b981]' />
            <span className='app-terminal__title ms-auto font-mono text-[11px]'>zsh — ai-kit bootstrap</span>
          </div>
          <div className='relative px-[22px] py-[18px] font-mono text-[14.5px] leading-loose'>
            {lines.map(line => {
              const isComment = line.prefix === '#'
              return (
                <div key={line.text}>
                  <span className={isComment ? 'app-terminal__dim' : 'app-terminal__prompt'}>
                    {line.prefix}
                  </span>{' '}
                  {renderTerminalLine(line.text, isComment)}
                </div>
              )
            })}
            <div>
              <span className='app-terminal__prompt'>$</span>{' '}
              <span
                aria-hidden
                className='app-terminal-cursor inline-block h-[1em] w-[0.55em] align-text-bottom'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

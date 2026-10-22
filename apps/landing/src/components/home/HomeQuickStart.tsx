import { Button, Toast } from '@polyms/ui-kit'
import { CodeSquare, Programming } from '@solar-icons/react-perf/BoldDuotone'
import type { ClipboardEvent } from 'react'
import { GITHUB_REPO } from '../../content/overlay'
import { copyText } from '../../lib/copy'
import { IconCopy } from '../../lib/icons'
import { trackEvent } from '../../lib/umami'
import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'
import { HomeSectionChip } from './HomeSectionChip'

const COMMAND = `npx skills add ${GITHUB_REPO} --skill '*' -a cursor -g`

/** Drop shell prompts and comments so a drag-select paste stays a real command. */
export function commandFromSelection(raw: string): string {
  return raw
    .split('\n')
    .filter(line => !/^\s*#/.test(line))
    .map(line => line.replace(/^[$>]\s?/, '').trimEnd())
    .filter(line => line.trim().length > 0)
    .join('\n')
}

function renderTerminalLine(text: string) {
  if (!text.includes(GITHUB_REPO)) {
    return <span className='app-terminal__prompt'>{text}</span>
  }

  const [before, after] = text.split(GITHUB_REPO)
  return (
    <>
      <span className='app-terminal__prompt'>{before}</span>
      <span className='app-terminal__repo'>{GITHUB_REPO}</span>
      <span className='app-terminal__text'>{after}</span>
    </>
  )
}

export function HomeQuickStart() {
  const toastManager = Toast.useToastManager()
  const lines = [
    { prefix: '$', text: 'npx skills add \\', comment: false },
    { prefix: '>', text: `${GITHUB_REPO} \\`, comment: false },
    { prefix: '>', text: "--skill '*' -a cursor -g", comment: false },
    { prefix: '#', text: m.quickstart_terminalComment(), comment: true },
  ] as const

  const handleCopyClick = async () => {
    const ok = await copyText(COMMAND)
    if (ok) {
      toastManager.add({ title: m.catalog_copied(), type: 'success' })
      trackEvent('copy_prompt', { skill: 'install', source: 'quick-start' })
    } else {
      toastManager.add({ title: m.catalog_copyFail(), type: 'danger' })
    }
  }

  const handleSelectionCopy = (event: ClipboardEvent<HTMLDivElement>) => {
    const raw = window.getSelection()?.toString() ?? ''
    const cleaned = commandFromSelection(raw)
    if (!cleaned || cleaned === raw) return
    event.preventDefault()
    event.clipboardData.setData('text/plain', cleaned)
  }

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
          className={`app-terminal relative min-w-75 max-w-120 flex-[1_1_380px] overflow-hidden rounded-[22px] ${HOME_PLAYFUL ? '-rotate-[0.6deg]' : ''}`}
        >
          <Programming
            aria-hidden
            className='app-terminal__watermark pointer-events-none absolute right-4 bottom-3 text-primary-600 opacity-35'
            size={80}
          />
          <div className='app-terminal__bar relative z-1 flex items-center gap-2 px-4.5 py-3'>
            <span className='size-2.5 shrink-0 rounded-full bg-[#f43f5e]' />
            <span className='size-2.5 shrink-0 rounded-full bg-[#f59e0b]' />
            <span className='size-2.5 shrink-0 rounded-full bg-[#10b981]' />
            <span className='app-terminal__title ms-auto font-mono text-[11px]'>zsh — npx skills</span>
            <Button className='shrink-0' onClick={handleCopyClick} rounded size='sm' variant='light'>
              <IconCopy aria-hidden size={14} />
              {m.catalog_copy()}
            </Button>
          </div>
          <div
            className='relative px-[22px] py-[18px] font-mono text-[13.5px] leading-loose'
            onCopy={handleSelectionCopy}
          >
            {lines.map(line => (
              <div className={line.comment ? 'select-none' : undefined} key={line.text}>
                <span
                  aria-hidden
                  className={`app-terminal__glyph ${line.comment ? 'app-terminal__dim' : 'app-terminal__prompt'}`}
                >
                  {line.prefix}{' '}
                </span>
                {line.comment ? (
                  <span className='app-terminal__dim'>{line.text}</span>
                ) : (
                  renderTerminalLine(line.text)
                )}
              </div>
            ))}
            <div>
              <span aria-hidden className='app-terminal__glyph app-terminal__prompt'>
                ${' '}
              </span>
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

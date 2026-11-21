import { Button, Toast } from '@polyms/ui-kit'
import { ChatRoundDots, Laptop, Programming, Settings } from '@solar-icons/react-perf/BoldDuotone'
import type { ClipboardEvent } from 'react'
import { GITHUB_REPO } from '../../content/overlay'
import { copyText } from '../../lib/copy'
import { IconCopy } from '../../lib/icons'
import { trackEvent } from '../../lib/umami'
import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'
import { HomeSectionChip } from './HomeSectionChip'

const MCP_URL = 'https://ai-kit.polyms.dev/mcp'
const COMMAND = `npx skills add ${GITHUB_REPO} --skill '*' -a cursor -g`

const NOTES = [
  {
    key: 'target',
    icon: Laptop,
    title: m.quickstart_target_title,
    body: m.quickstart_target_body,
    commands: ['-a claude-code', '-a codex', '-a github-copilot'],
  },
  {
    key: 'setup',
    icon: Settings,
    title: m.quickstart_setup_title,
    body: m.quickstart_setup_body,
    commands: [],
  },
] as const

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

  const handleMcpCopy = async () => {
    const ok = await copyText(MCP_URL)
    toastManager.add({ title: ok ? m.catalog_copied() : m.catalog_copyFail(), type: ok ? 'success' : 'danger' })
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
      <h2 className='app-install__title m-0 mb-3 font-bold font-sans text-fg'>{m.quickstart_choose()}</h2>
      <p className='mb-8 max-w-[720px] text-muted'>{m.quickstart_choose_body()}</p>

      <div className='mb-10 rounded-[24px] border border-line bg-body p-6 sm:p-8' id='chat-start'>
        <span className='app-catalog-card__icon mb-4 flex size-11 items-center justify-center rounded-full'>
          <ChatRoundDots aria-hidden className='text-primary-600' size={22} />
        </span>
        <h3 className='m-0 mb-2 font-bold font-sans text-[21px] text-fg'>{m.quickstart_mcp_title()}</h3>
        <p className='mb-4 max-w-[720px] text-muted'>{m.quickstart_mcp_body()}</p>
        <div className='flex flex-wrap items-center gap-3'>
          <code className='min-w-0 max-w-full break-all rounded-lg border border-line bg-surface px-3 py-2 font-mono text-sm text-fg'>{MCP_URL}</code>
          <Button onClick={handleMcpCopy} rounded size='sm' variant='light'>
            <IconCopy aria-hidden size={14} />
            {m.catalog_copy()}
          </Button>
        </div>
        <ol className='mt-5 list-decimal space-y-2 ps-5 text-sm text-muted leading-relaxed'>
          <li>{m.quickstart_chat_step1()}</li>
          <li>{m.quickstart_chat_step2()}</li>
          <li>{m.quickstart_chat_step3()}</li>
        </ol>
        <div className='mt-5 rounded-xl border border-line bg-surface px-4 py-3'>
          <span className='mb-1 block font-mono text-xs text-muted'>{m.catalog_samplePrompt()}</span>
          <p className='m-0 text-sm text-fg'>{m.quickstart_chat_example()}</p>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-14' id='dev-start'>
        <div className='min-w-[280px] max-w-[460px] flex-[1_1_380px]'>
          <h3 className='app-install__title m-0 mb-5 font-bold font-sans text-fg'>
            {m.quickstart_dev_title()}
          </h3>
          <p className='m-0 mb-7 text-[17px] text-muted leading-relaxed'>{m.quickstart_body()}</p>
          <Button render={<a href='/#catalog' />} rounded size='lg' variant='primary'>
            {m.home_catalog_all()} →
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
      <div className='mt-16'>
        <div className='mb-6 flex items-baseline gap-3.5'>
          <h3 className='m-0 font-bold font-sans text-[21px] text-fg tracking-tight'>
            {m.quickstart_notes_title()}
          </h3>
          <span aria-hidden className='h-px flex-1 bg-line' />
        </div>
        <ul className='m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2'>
          {NOTES.map(({ key, icon: Icon, title, body, commands }) => (
            <li className='flex flex-col rounded-[24px] border border-line bg-body p-6' key={key}>
              <span className='app-catalog-card__icon mb-5 flex size-11 shrink-0 items-center justify-center rounded-full'>
                <Icon aria-hidden className='text-primary-600' size={22} />
              </span>
              <div className='min-w-0'>
                <div className='mb-1.5 font-bold font-sans text-[17px] text-fg'>{title()}</div>
                <p className='m-0 text-[14.5px] text-muted leading-relaxed'>{body()}</p>
                {commands.length > 0 ? (
                  <div className='mt-3 flex flex-wrap gap-1.5'>
                    {commands.map(command => (
                      <code
                        className='max-w-full break-all rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[12.5px] text-fg'
                        key={command}
                      >
                        {command}
                      </code>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

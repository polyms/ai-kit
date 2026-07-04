import { Programming } from '@solar-icons/react-perf/BoldDuotone'
import { BRAND_ACCENT, HOME_PLAYFUL } from './brand'

const LINES = [
  { prefix: '$', text: 'git clone git@github.com:polyms/ai-kit.git ~/src/ai-kit' },
  { prefix: '$', text: 'cd ~/src/ai-kit' },
  { prefix: '$', text: 'pnpm bootstrap' },
  { prefix: '#', text: 'symlinks agents + skills into Cursor and Claude Code' },
] as const

export function HomeQuickStart() {
  return (
    <section id='start' className='demo-shell mx-auto max-w-[820px] px-10 pb-24'>
      <div
        className={`relative overflow-hidden rounded-[22px] bg-slate-900 shadow-popout ${HOME_PLAYFUL ? '-rotate-[0.6deg]' : ''}`}
      >
        <Programming
          size={80}
          color={BRAND_ACCENT}
          className='demo-terminal__watermark pointer-events-none absolute -top-2.5 right-6 opacity-35'
          aria-hidden
        />
        <div className='flex items-center gap-2 border-slate-800 border-b px-[18px] py-3'>
          <span className='size-2.5 shrink-0 rounded-full bg-[#f43f5e]' />
          <span className='size-2.5 shrink-0 rounded-full bg-[#f59e0b]' />
          <span className='size-2.5 shrink-0 rounded-full bg-[#10b981]' />
          <span className='ms-auto font-mono text-[11px] text-slate-400'>zsh — ai-kit bootstrap</span>
        </div>
        <div className='relative px-[22px] py-[18px] font-mono font-semibold text-[14.5px] leading-loose'>
          {LINES.map(line => (
            <div key={line.text}>
              <span className='text-[#c0c8d4]'>{line.prefix}</span>{' '}
              <span className={line.prefix === '#' ? 'text-[#7d8290]' : 'text-[#fdba74]'}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

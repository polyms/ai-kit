import { m } from '../../paraglide/messages.js'
import { HOME_PLAYFUL } from './brand'
import { HomeSectionChip } from './HomeSectionChip'

const STAGES = [
  { label: m.pipeline_stage_idea },
  { label: m.pipeline_stage_align, invoke: '/align' },
  { label: m.pipeline_stage_reqs, invoke: '/reqs | /to-prd' },
  { label: m.pipeline_stage_issues, invoke: '/to-issues' },
  { label: m.pipeline_stage_design, invoke: '/design' },
  { label: m.pipeline_stage_dev, invoke: '/dev' },
  { label: m.pipeline_stage_review, invoke: '/code-review' },
  { label: m.pipeline_stage_ship },
] as const

const AGENTS = [
  {
    name: 'pm',
    role: m.pipeline_agent_pm_role,
    owns: m.pipeline_agent_pm_owns,
  },
  {
    name: 'designer',
    role: m.pipeline_agent_design_role,
    owns: m.pipeline_agent_design_owns,
  },
  {
    name: 'developer',
    role: m.pipeline_agent_dev_role,
    owns: m.pipeline_agent_dev_owns,
  },
  {
    name: 'tester',
    role: m.pipeline_agent_tester_role,
    owns: m.pipeline_agent_tester_owns,
  },
  {
    name: 'techlead',
    role: m.pipeline_agent_techlead_role,
    owns: m.pipeline_agent_techlead_owns,
  },
] as const

function StageChip({ label, invoke, last }: { label: string; invoke?: string; last?: boolean }) {
  return (
    <div className='flex shrink-0 items-center gap-2.5'>
      <div className='flex min-w-[108px] flex-col items-center gap-1 rounded-2xl border border-line bg-body px-[18px] py-3.5'>
        {invoke ? (
          <span className='whitespace-nowrap font-bold font-mono text-[14px] text-primary-600'>{invoke}</span>
        ) : null}
        <span className='whitespace-nowrap text-center font-semibold text-[12.5px] text-fg'>{label}</span>
      </div>
      {!last ? (
        <span aria-hidden className='shrink-0 font-mono text-[18px] text-line'>
          →
        </span>
      ) : null}
    </div>
  )
}

export function HomePipeline() {
  return (
    <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='pipeline'>
      <HomeSectionChip label='pipeline' n='02' />
      <h2 className='app-pipeline__title m-0 mb-3 font-bold font-sans text-fg'>{m.pipeline_title()}</h2>
      <p className='mb-9 max-w-[640px] text-muted'>{m.pipeline_intro()}</p>

      <div className='app-pipeline__stages mb-12 flex gap-2.5 overflow-x-auto pb-2'>
        {STAGES.map((stage, i) => (
          <StageChip
            invoke={'invoke' in stage ? stage.invoke : undefined}
            key={'invoke' in stage ? stage.invoke : i}
            label={stage.label()}
            last={i === STAGES.length - 1}
          />
        ))}
      </div>

      <div className='mb-5 flex items-baseline gap-2.5'>
        <span className='font-bold font-mono text-[12px] text-muted uppercase tracking-wider'>
          {m.pipeline_agentsLabel()}
        </span>
        <span aria-hidden className='h-px flex-1 bg-line' />
      </div>
      <div className='flex flex-wrap gap-4'>
        {AGENTS.map((agent, i) => {
          const playfulRotate =
            HOME_PLAYFUL && i % 2 === 0 ? '-rotate-[0.3deg]' : HOME_PLAYFUL ? 'rotate-[0.3deg]' : ''
          return (
            <div
              className={`min-w-[220px] flex-[1_1_220px] rounded-[20px] border border-line bg-body p-[22px] ${playfulRotate}`}
              key={agent.name}
            >
              <div className='mb-2 font-bold font-mono text-[15px] text-primary-600'>{agent.name}</div>
              <div className='mb-1.5 font-bold text-[15px] text-fg'>{agent.role()}</div>
              <div className='text-[13.5px] text-muted leading-snug'>{agent.owns()}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

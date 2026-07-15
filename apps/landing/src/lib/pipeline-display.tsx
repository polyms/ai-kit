import { SkillInvokeText } from '../components/SkillInvokeText'
import type { ResolvedSkillPipeline } from './skills'

type PipelineDisplayProps = {
  pipeline: ResolvedSkillPipeline
  upstreamLabel: string
  downstreamLabel: string
}

function PipelineValue({ value }: { value: string }) {
  return <SkillInvokeText text={value} />
}

export function PipelineDisplay({ pipeline, upstreamLabel, downstreamLabel }: PipelineDisplayProps) {
  if (typeof pipeline === 'string') {
    return (
      <p>
        <SkillInvokeText text={pipeline} />
      </p>
    )
  }

  return (
    <dl className='space-y-2'>
      {pipeline.upstream && (
        <div>
          <dt className='font-medium text-fg'>{upstreamLabel}</dt>
          <dd>
            {Array.isArray(pipeline.upstream) ? (
              pipeline.upstream.map((line, i) => (
                <span key={line}>
                  {i > 0 ? ' · ' : null}
                  <PipelineValue value={line} />
                </span>
              ))
            ) : (
              <PipelineValue value={pipeline.upstream} />
            )}
          </dd>
        </div>
      )}
      {pipeline.downstream && (
        <div>
          <dt className='font-medium text-fg'>{downstreamLabel}</dt>
          <dd>
            {Array.isArray(pipeline.downstream) ? (
              pipeline.downstream.map((line, i) => (
                <span key={line}>
                  {i > 0 ? ' · ' : null}
                  <PipelineValue value={line} />
                </span>
              ))
            ) : (
              <PipelineValue value={pipeline.downstream} />
            )}
          </dd>
        </div>
      )}
    </dl>
  )
}

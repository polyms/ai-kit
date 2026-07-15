import { GITHUB_REPO } from '../content/overlay'
import type { ResolvedAgentPanel } from '../lib/skills'
import { m } from '../paraglide/messages.js'

type AgentPanelProps = {
  panel: ResolvedAgentPanel
  relatedAgents?: string[]
}

function formatOwns(owns: string | string[]) {
  return Array.isArray(owns) ? owns.join(', ') : owns
}

export function AgentPanel({ panel, relatedAgents }: AgentPanelProps) {
  return (
    <div className='agent-panel'>
      <p className='label-mono'>{m.catalog_agentHint()}</p>
      <p className='mt-2 font-semibold text-sm'>{panel.role}</p>
      <p className='mt-1 text-muted text-sm'>
        <span className='font-medium text-fg'>{m.skillDetail_owns()}:</span> {formatOwns(panel.owns)}
      </p>
      <pre className='mt-3 font-invoke text-sm'>{panel.invokeHint}</pre>
      {relatedAgents && relatedAgents.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-3 font-invoke text-sm'>
          {relatedAgents.map(agent => (
            <a
              className='text-primary-700 hover:underline'
              href={`${GITHUB_REPO}/blob/main/agents/${agent}.md`}
              key={agent}
              rel='noopener noreferrer'
              target='_blank'
            >
              {agent} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

import type { AgentPanel as AgentPanelData } from '../content/overlay'
import { GITHUB_REPO } from '../content/overlay'
import { useT } from '../lib/i18n'

type AgentPanelProps = {
  panel: AgentPanelData
  relatedAgents?: string[]
}

function formatOwns(owns: string | string[]) {
  return Array.isArray(owns) ? owns.join(', ') : owns
}

export function AgentPanel({ panel, relatedAgents }: AgentPanelProps) {
  const t = useT()

  return (
    <div className='agent-panel'>
      <p className='label-mono'>{t('catalog.agentHint')}</p>
      <p className='mt-2 font-semibold text-sm'>{panel.role}</p>
      <p className='mt-1 text-muted text-sm'>
        <span className='font-medium text-fg'>Owns:</span> {formatOwns(panel.owns)}
      </p>
      <pre className='mt-3 font-invoke text-sm'>{panel.invokeHint}</pre>
      {relatedAgents && relatedAgents.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-3 font-invoke text-sm'>
          {relatedAgents.map(agent => (
            <a
              key={agent}
              href={`${GITHUB_REPO}/blob/main/agents/${agent}.md`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary-700 hover:underline'
            >
              {agent} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

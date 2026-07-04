import type { ReactNode } from 'react'
import { CopyPromptButton } from './CopyPromptButton'

type TerminalPromptBlockProps = {
  label: string
  text: string
  skill?: string
  source?: string
  children?: ReactNode
}

export function TerminalPromptBlock({ label, text, skill, source, children }: TerminalPromptBlockProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-line bg-surface'>
      <div className='flex items-center justify-between border-line border-b px-4 py-2'>
        <span className='font-invoke text-muted text-xs'>{label}</span>
        {text && <CopyPromptButton skill={skill} source={source} text={text} />}
      </div>
      {children ?? (
        <pre className='overflow-x-auto whitespace-pre-wrap p-4 font-invoke text-primary-700 text-sm leading-relaxed'>
          {text}
        </pre>
      )}
    </div>
  )
}

import { Field } from '@polyms/core-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { stringify as stringifyYaml } from 'yaml'
import { IconCheckCircle, IconMagnifier } from '../../lib/icons'
import {
  type CodeToken,
  type CodeTokenType,
  tokenizeJson,
  tokenizeYaml,
} from '../../lib/knowledge/code-highlight'
import type { KnowledgeChunk } from '../../lib/knowledge/knowledge.types'
import { m } from '../../paraglide/messages.js'

const MARKDOWN_COMPONENTS: Components = {
  a: props => <a className='link link-primary' {...props} />,
  blockquote: props => <blockquote className='border-line border-s-2 ps-3 text-muted italic' {...props} />,
  code: props => <code className='rounded bg-surface px-1 py-0.5 font-mono text-xs' {...props} />,
  h1: props => <h4 className='font-bold text-base' {...props} />,
  h2: props => <h4 className='font-bold text-base' {...props} />,
  h3: props => <h4 className='font-bold text-sm' {...props} />,
  li: props => <li className='text-sm' {...props} />,
  ol: props => <ol className='list-decimal space-y-1 ps-5' {...props} />,
  p: props => <p className='text-sm leading-relaxed' {...props} />,
  table: props => (
    <div className='overflow-x-auto'>
      <table className='table-hover table w-full text-sm' {...props} />
    </div>
  ),
  ul: props => <ul className='list-disc space-y-1 ps-5' {...props} />,
}

type KnowledgeMarkdownProps = {
  children: string
}

function KnowledgeMarkdown({ children }: KnowledgeMarkdownProps) {
  return (
    <div className='space-y-3'>
      <Markdown components={MARKDOWN_COMPONENTS} remarkPlugins={[remarkGfm]}>
        {children}
      </Markdown>
    </div>
  )
}

export function intentLabel(intent: string): string {
  switch (intent) {
    case 'incident':
      return m.knowledge_intent_incident()
    case 'design':
      return m.knowledge_intent_design()
    case 'toolchain':
      return m.knowledge_intent_toolchain()
    default:
      return intent
  }
}

export function intentItemClass(intent: string): string {
  switch (intent) {
    case 'incident':
      return 'item-incident'
    case 'design':
      return 'item-design'
    case 'toolchain':
      return 'item-toolchain'
    default:
      return 'bg-surface text-muted'
  }
}

export function chunkTypeLabel(chunkType: string): string {
  switch (chunkType) {
    case 'incident':
      return m.knowledge_chunkType_incident()
    case 'seam':
      return m.knowledge_chunkType_seam()
    case 'config':
      return m.knowledge_chunkType_config()
    case 'checklist':
      return m.knowledge_chunkType_checklist()
    case 'prose':
      return m.knowledge_chunkType_prose()
    default:
      return chunkType
  }
}

type KnowledgeSearchProps = {
  query: string
  onQueryChange: (q: string) => void
}

export function KnowledgeSearch({ query, onQueryChange }: KnowledgeSearchProps) {
  const [value, setValue] = useState(query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setValue(query)
  }, [query])

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  return (
    <div className='relative'>
      <Field className='w-full' name='knowledge-search'>
        <Field.Label className='sr-only'>{m.knowledge_searchLabel()}</Field.Label>
        <Field.Control
          aria-label={m.knowledge_searchLabel()}
          autoComplete='off'
          className='min-h-11 rounded-full border-none bg-surface ps-10 font-mono text-sm shadow-none'
          onChange={e => {
            const next = e.target.value
            setValue(next)
            clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => onQueryChange(next), 300)
          }}
          placeholder={m.knowledge_searchPlaceholder()}
          type='search'
          value={value}
        />
      </Field>
      <IconMagnifier
        aria-hidden
        className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted'
        size={18}
      />
    </div>
  )
}

type AxisTagRowProps = {
  tags: string[]
}

export function AxisTagRow({ tags }: AxisTagRowProps) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {tags.map(tag => (
        <span
          className='inline-flex items-center rounded-full bg-surface px-2.5 py-1 font-mono text-muted text-xs'
          key={tag}
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

type KnowledgeCheckListProps = {
  items: string[]
}

export function KnowledgeCheckList({ items }: KnowledgeCheckListProps) {
  return (
    <ul className='list-none divide-y divide-line'>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: items are static text and may repeat; position is the identity
        <li className='flex items-start gap-2.5 py-2 text-sm' key={`${index}-${item}`}>
          <IconCheckCircle aria-hidden className='mt-0.5 shrink-0 text-success-600' size={16} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

type ConfigViewMode = 'json' | 'yaml'

const CODE_TOKEN_CLASS: Record<CodeTokenType, string | undefined> = {
  comment: 'text-slate-500 italic',
  key: 'text-primary-300',
  keyword: 'text-danger-300',
  number: 'text-warning-300',
  plain: undefined,
  punct: 'text-slate-500',
  string: 'text-success-300',
}

function HighlightedCode({ tokens }: { tokens: CodeToken[] }) {
  return (
    <code>
      {tokens.map((token, index) => {
        const className = CODE_TOKEN_CLASS[token.type]
        return className === undefined ? (
          token.text
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: tokens are a static, order-stable decomposition of the body
          <span className={className} key={index}>
            {token.text}
          </span>
        )
      })}
    </code>
  )
}

function jsonBodyToYaml(body: string): string | undefined {
  const trimmed = body.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return undefined
  try {
    return stringifyYaml(JSON.parse(trimmed)).trimEnd()
  } catch {
    return undefined
  }
}

const YAML_FILENAME_PATTERN = /\.ya?ml$/i

type KnowledgeConfigBlockProps = {
  artifactFilename: string | null
  body: string
}

function KnowledgeConfigBlock({ artifactFilename, body }: KnowledgeConfigBlockProps) {
  const [mode, setMode] = useState<ConfigViewMode>('json')
  const yamlBody = useMemo(() => jsonBodyToYaml(body), [body])
  const tokens = useMemo(() => {
    if (yamlBody !== undefined) return mode === 'yaml' ? tokenizeYaml(yamlBody) : tokenizeJson(body)
    if (artifactFilename !== null && YAML_FILENAME_PATTERN.test(artifactFilename)) return tokenizeYaml(body)
    return undefined
  }, [artifactFilename, body, yamlBody, mode])

  return (
    <div className='relative mt-3'>
      {yamlBody !== undefined ? (
        <div className='absolute inset-e-2.5 top-2.5 flex rounded-full bg-white/10 p-0.5 font-mono text-[10px]'>
          {(['json', 'yaml'] satisfies ConfigViewMode[]).map(option => (
            <button
              aria-pressed={mode === option}
              className={`rounded-full px-2 py-0.5 uppercase transition-colors ${
                mode === option ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              key={option}
              onClick={() => setMode(option)}
              type='button'
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
      <pre className='knowledge-config overflow-x-auto rounded-2xl bg-slate-950 p-4 text-slate-100 text-xs leading-relaxed'>
        {tokens === undefined ? <code>{body}</code> : <HighlightedCode tokens={tokens} />}
      </pre>
    </div>
  )
}

type KnowledgeChunkBlockProps = {
  chunk: KnowledgeChunk
}

export function KnowledgeChunkBlock({ chunk }: KnowledgeChunkBlockProps) {
  return (
    <section className='knowledge-chunk pt-12' id={chunk.slug}>
      <div className='flex flex-wrap items-center gap-2'>
        <h3 className='h3 min-w-0 flex-1 font-bold'>{chunk.title}</h3>
        {chunk.artifactFilename ? (
          <span className='rounded-full bg-surface px-2.5 py-1 font-mono text-muted text-xs'>
            {chunk.artifactFilename}
          </span>
        ) : null}
        <span className='badge badge-light whitespace-nowrap font-mono text-xs uppercase'>
          {chunkTypeLabel(chunk.chunkType)}
        </span>
      </div>

      {chunk.chunkType === 'config' ? (
        <KnowledgeConfigBlock artifactFilename={chunk.artifactFilename} body={chunk.body} />
      ) : (
        <div className='mt-3'>
          <KnowledgeMarkdown>{chunk.body}</KnowledgeMarkdown>
        </div>
      )}

      {chunk.chunkType === 'incident' ? (
        <dl className='mt-4 space-y-3 text-sm'>
          {chunk.cause.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_cause()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5'>
                  {chunk.cause.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: items are static text and may repeat; position is the identity
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
          {chunk.fix.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_fix()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5'>
                  {chunk.fix.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: items are static text and may repeat; position is the identity
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
          {chunk.verify.length > 0 ? (
            <div>
              <dt className='label-mono'>{m.knowledge_verify()}</dt>
              <dd>
                <ul className='mt-1 list-disc space-y-1 ps-5 font-mono text-xs'>
                  {chunk.verify.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: items are static text and may repeat; position is the identity
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {chunk.chunkType === 'checklist' && chunk.checklistItems.length > 0 ? (
        <div className='mt-3 rounded-2xl border border-line px-4'>
          <KnowledgeCheckList items={chunk.checklistItems} />
        </div>
      ) : null}
    </section>
  )
}

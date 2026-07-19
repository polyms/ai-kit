import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import {
  AxisTagRow,
  chunkTypeLabel,
  intentLabel,
  KnowledgeCheckList,
  KnowledgeChunkBlock,
} from '../../components/knowledge'
import { IconChecklistMinimalistic, IconTuning2 } from '../../lib/icons'
import { defaultKnowledgeSearch, getKnowledgeArticleFn } from '../../lib/knowledge/knowledge.fns'
import { m } from '../../paraglide/messages.js'

export const Route = createFileRoute('/knowledge/$id')({
  loader: async ({ params: { id } }) => {
    try {
      return { article: await getKnowledgeArticleFn({ data: { id } }) }
    } catch {
      throw new Error('NOT_FOUND')
    }
  },
  component: KnowledgeDetailPage,
  errorComponent: KnowledgeNotFound,
})

function KnowledgeNotFound() {
  return (
    <div className='px-8 py-16'>
      <div className='rounded-lg border border-line border-dashed py-16 text-center'>
        <p className='text-muted'>{m.knowledge_notFound()}</p>
        <RouterLink
          className='link link-primary mt-4 inline-block text-sm'
          search={defaultKnowledgeSearch}
          to='/knowledge'
        >
          {m.knowledge_backToIndex()}
        </RouterLink>
      </div>
    </div>
  )
}

function KnowledgeDetailPage() {
  const { article } = Route.useLoaderData()
  const hasToc = article.chunks.length > 1

  return (
    <div className='knowledge-page w-full px-8 py-10 lg:px-12'>
      <div className='flex flex-wrap items-center gap-2.5'>
        <span className='inline-flex items-center rounded-full bg-surface px-2.5 py-1 font-mono text-muted text-xs'>
          {article.id}
        </span>
        <span className='badge badge-primary inline-flex items-center gap-1'>
          <IconTuning2 aria-hidden size={12} />
          {m.knowledge_intent()}: {intentLabel(article.intent)}
        </span>
      </div>

      <h1 className='h1 mt-3'>{article.title}</h1>

      <div className='mt-4'>
        <AxisTagRow tags={article.axisTags} />
      </div>

      <div className='mt-10 flex flex-col gap-10 xl:flex-row'>
        <div className='min-w-0 flex-1'>
          {article.checklist.length > 0 ? (
            <div className='mb-8 rounded-2xl border border-line border-dashed p-5'>
              <div className='mb-2 flex items-center gap-2'>
                <IconChecklistMinimalistic aria-hidden className='text-primary-600' size={18} />
                <span className='font-bold text-sm'>{m.knowledge_checklist()}</span>
              </div>
              <KnowledgeCheckList items={article.checklist} />
            </div>
          ) : null}

          <div>
            {article.chunks.map(chunk => (
              <KnowledgeChunkBlock chunk={chunk} key={chunk.id} />
            ))}
          </div>
        </div>

        {hasToc ? (
          <div className='shrink-0 xl:w-56'>
            <div className='xl:sticky xl:top-8'>
              <p className='label-mono mb-2 text-muted'>
                {m.knowledge_readingOrder()} · {article.chunks.length}
              </p>
              <nav aria-label={m.knowledge_chunkNav()}>
                <ol className='list-none space-y-1'>
                  {article.chunks.map((chunk, index) => (
                    <li key={chunk.id}>
                      <a
                        className='flex items-center gap-2.5 rounded-lg px-2.5 py-2 no-underline hover:bg-surface'
                        href={`#${chunk.slug}`}
                      >
                        <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface font-mono text-[10.5px] text-muted'>
                          {index + 1}
                        </span>
                        <span className='min-w-0 flex-1'>
                          <span className='block truncate font-semibold text-fg text-xs'>{chunk.title}</span>
                          <span className='block text-[11px] text-muted'>
                            {chunkTypeLabel(chunk.chunkType)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

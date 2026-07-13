import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { AxisTagRow, intentLabel, KnowledgeBreadcrumb, KnowledgeChunkBlock } from '../../components/knowledge'
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
    <div className='page-x section-y mx-auto max-w-4xl'>
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

  return (
    <div className='knowledge-page page-x section-y mx-auto max-w-4xl'>
      <KnowledgeBreadcrumb
        items={[{ label: m.knowledge_title(), href: '/knowledge' }, { label: article.id }]}
      />

      <p className='label-mono'>{article.id}</p>
      <h1 className='h1 mt-2'>
        {article.id}: {article.title}
      </h1>
      <div className='mt-4 flex flex-wrap items-center gap-2'>
        <span className='label-mono'>{m.knowledge_intent()}</span>
        <span className='badge badge-primary'>{intentLabel(article.intent)}</span>
        <AxisTagRow tags={article.axisTags} />
      </div>

      {article.checklist.length > 0 ? (
        <section
          className='knowledge-section mt-10 rounded-lg border border-line bg-surface p-5'
          id='checklist'
        >
          <h2 className='h2'>{m.knowledge_checklist()}</h2>
          <ul className='mt-4 list-none space-y-2'>
            {article.checklist.map(item => (
              <li className='flex gap-2 text-sm' key={item}>
                <span aria-hidden className='text-primary-700'>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className='knowledge-section mt-12' id='chunks'>
        <div className='flex items-baseline gap-2'>
          <h2 className='h2'>{m.knowledge_chunks()}</h2>
          <span className='badge badge-light font-mono'>{article.chunks.length}</span>
        </div>

        {article.chunks.length > 1 ? (
          <nav
            aria-label={m.knowledge_chunkNav()}
            className='mt-4 rounded-lg border border-line bg-surface p-4'
          >
            <p className='label-mono text-xs'>{m.knowledge_readingOrder()}</p>
            <ol className='mt-2 list-decimal space-y-1 ps-5 text-sm'>
              {article.chunks.map(chunk => (
                <li key={chunk.id}>
                  <a className='link' href={`#${chunk.slug}`}>
                    {chunk.title}
                  </a>
                  <span className='ms-2 font-mono text-muted text-xs uppercase'>{chunk.chunkType}</span>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {article.chunks.map(chunk => (
          <KnowledgeChunkBlock chunk={chunk} key={chunk.id} />
        ))}
      </section>
    </div>
  )
}

import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { AxisTagRow, KnowledgeBreadcrumb, KnowledgeChunkBlock } from '../../components/knowledge'
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
      <p className='text-muted'>{m.knowledge_notFound()}</p>
      <RouterLink
        className='link link-primary mt-4 inline-block'
        search={defaultKnowledgeSearch}
        to='/knowledge'
      >
        {m.knowledge_backToIndex()}
      </RouterLink>
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
      <p className='mt-2 text-muted'>
        {m.knowledge_intent()}: {article.intent}
      </p>
      <div className='mt-4'>
        <AxisTagRow tags={article.axisTags} />
      </div>

      {article.checklist.length > 0 ? (
        <section className='knowledge-section mt-10' id='checklist'>
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
        <h2 className='h2'>
          {m.knowledge_chunks()} ({article.chunks.length})
        </h2>

        {article.chunks.length > 1 ? (
          <nav aria-label={m.knowledge_chunkNav()} className='mt-4 rounded-md border border-line p-4'>
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

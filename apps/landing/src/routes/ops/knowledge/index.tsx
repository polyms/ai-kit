import { Button } from '@polyms/ui-kit'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { OpsShell } from '../../../components/ops'
import { defaultKnowledgeSearch } from '../../../lib/knowledge/knowledge.fns'
import { listOpsKnowledgeFn } from '../../../lib/ops/ops.cms.fns'
import { m } from '../../../paraglide/messages.js'

export const Route = createFileRoute('/ops/knowledge/')({
  loader: async () => listOpsKnowledgeFn(),
  component: OpsKnowledgePage,
})

function intentLabel(intent: string): string {
  switch (intent) {
    case 'incident':
      return m.ops_intent_incident()
    case 'design':
      return m.ops_intent_design()
    case 'toolchain':
      return m.ops_intent_toolchain()
    default:
      return intent
  }
}

function OpsKnowledgePage() {
  const { rows } = Route.useLoaderData()

  return (
    <OpsShell active='knowledge'>
      <div className='page-x section-y mx-auto max-w-7xl'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h1 className='h1'>{m.ops_knowledgeTitle()}</h1>
          <Button disabled rounded size='lg' variant='primary'>
            {m.ops_createKnowledge()}
          </Button>
        </div>

        {rows.length === 0 ? <p className='mt-8 text-muted'>{m.ops_knowledgeEmpty()}</p> : null}

        {rows.length > 0 ? (
          <div className='mt-8 overflow-x-auto'>
            <table className='table-hover table-bordered table w-full'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>{m.ops_col_id()}</th>
                  <th scope='col'>{m.ops_col_title()}</th>
                  <th scope='col'>{m.knowledge_intent()}</th>
                  <th scope='col'>{m.ops_col_status()}</th>
                  <th scope='col'>{m.ops_col_tags()}</th>
                  <th scope='col'>{m.ops_col_updated()}</th>
                  <th scope='col'>{m.ops_col_actions()}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className='font-mono text-sm'>{row.id}</td>
                    <td>{row.title}</td>
                    <td className='font-mono text-xs uppercase'>{intentLabel(row.intent)}</td>
                    <td>
                      <span
                        className={`badge ${row.status === 'published' ? 'badge-success' : 'badge-light'}`}
                      >
                        {row.status === 'published' ? m.ops_status_published() : m.ops_status_draft()}
                      </span>
                    </td>
                    <td>
                      <div className='flex flex-wrap gap-1'>
                        {row.axisTags.slice(0, 4).map(tag => (
                          <span className='badge badge-light' key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='text-muted text-sm'>{row.updatedAt.slice(0, 10)}</td>
                    <td className='text-sm'>
                      <RouterLink
                        className='link link-primary me-3'
                        params={{ id: row.id }}
                        search={defaultKnowledgeSearch}
                        to='/knowledge/$id'
                      >
                        {m.ops_viewPublic()}
                      </RouterLink>
                      <span className='text-muted'>{m.ops_edit()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </OpsShell>
  )
}

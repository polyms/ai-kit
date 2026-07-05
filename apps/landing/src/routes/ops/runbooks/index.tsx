import { Button } from '@polyms/core-ui'
import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import { OpsShell } from '../../../components/ops'
import { listOpsRunbooksFn } from '../../../lib/ops/ops.cms.fns'
import { m } from '../../../paraglide/messages.js'

export const Route = createFileRoute('/ops/runbooks/')({
  loader: async () => listOpsRunbooksFn(),
  component: OpsRunbooksPage,
})

function OpsRunbooksPage() {
  const { rows } = Route.useLoaderData()

  return (
    <OpsShell active='runbooks'>
      <div className='page-x section-y mx-auto max-w-7xl'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h1 className='h1'>{m.ops_runbooksTitle()}</h1>
          <Button disabled rounded size='lg' variant='primary'>
            {m.ops_createRunbook()}
          </Button>
        </div>

        {rows.length === 0 ? <p className='mt-8 text-muted'>{m.ops_runbooksEmpty()}</p> : null}

        {rows.length > 0 ? (
          <div className='mt-8 overflow-x-auto'>
            <table className='table-hover table-bordered table w-full'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>{m.ops_col_id()}</th>
                  <th scope='col'>{m.ops_col_title()}</th>
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
                        to='/runbooks/$id'
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

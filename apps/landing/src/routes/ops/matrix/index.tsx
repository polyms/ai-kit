import { Tabs } from '@polyms/core-ui'
import { createFileRoute } from '@tanstack/react-router'
import { OpsShell } from '../../../components/ops'
import { getOpsMatrixFn } from '../../../lib/ops/ops.cms.fns'
import { axisComboMatches, type MatrixAxisCombo } from '../../../lib/ops/ops.types'
import { m } from '../../../paraglide/messages.js'

export const Route = createFileRoute('/ops/matrix/')({
  loader: async () => getOpsMatrixFn(),
  component: OpsMatrixPage,
})

function OpsMatrixPage() {
  const { runbooks, guides, runbookCombos, guideCombos } = Route.useLoaderData()

  return (
    <OpsShell active='matrix'>
      <div className='page-x section-y mx-auto max-w-7xl'>
        <h1 className='h1'>{m.ops_matrixTitle()}</h1>
        <p className='mt-2 text-muted'>{m.ops_matrixSub()}</p>

        <Tabs className='mt-8' defaultValue='runbooks'>
          <Tabs.List>
            <Tabs.Tab value='runbooks'>{m.ops_matrixRunbooks()}</Tabs.Tab>
            <Tabs.Tab value='guides'>{m.ops_matrixGuides()}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className='mt-6' value='runbooks'>
            <MatrixGrid combos={runbookCombos} empty={runbookCombos.length === 0} items={runbooks} />
          </Tabs.Panel>

          <Tabs.Panel className='mt-6' value='guides'>
            <MatrixGrid combos={guideCombos} empty={guideCombos.length === 0} items={guides} />
          </Tabs.Panel>
        </Tabs>

        <p className='mt-6 text-muted text-sm'>
          {m.ops_matrixLegendCovered()} = ✓ · {m.ops_matrixLegendGap()} = —
        </p>
      </div>
    </OpsShell>
  )
}

type MatrixItem = { id: string; axisTags: string[] }

type MatrixGridProps = {
  combos: MatrixAxisCombo[]
  items: MatrixItem[]
  empty: boolean
}

function MatrixGrid({ combos, items, empty }: MatrixGridProps) {
  if (empty) {
    return <p className='text-muted'>{m.ops_matrixEmpty()}</p>
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table-bordered table w-full text-sm'>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>Axis combo</th>
            {items.map(item => (
              <th className='font-mono' key={item.id} scope='col'>
                {item.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combos.map(combo => (
            <tr key={combo.key}>
              <td className='font-mono text-xs'>{combo.label}</td>
              {items.map(item => {
                const covered = axisComboMatches(item.axisTags, combo)
                return (
                  <td className={`text-center ${covered ? 'matrix-covered' : 'matrix-gap'}`} key={item.id}>
                    {covered ? '✓' : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

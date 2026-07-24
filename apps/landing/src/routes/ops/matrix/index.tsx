import { Tabs } from '@polyms/ui-kit'
import { createFileRoute } from '@tanstack/react-router'
import { OpsShell } from '../../../components/ops'
import { getOpsMatrixFn } from '../../../lib/ops/ops.cms.fns'
import { axisComboMatches, KNOWLEDGE_INTENTS, type MatrixAxisCombo } from '../../../lib/ops/ops.types'
import { m } from '../../../paraglide/messages.js'

export const Route = createFileRoute('/ops/matrix/')({
  loader: async () => getOpsMatrixFn(),
  component: OpsMatrixPage,
})

function OpsMatrixPage() {
  const { knowledge, knowledgeCombos, knowledgeIntentCoverage } = Route.useLoaderData()

  return (
    <OpsShell active='matrix'>
      <div className='page-x section-y mx-auto max-w-7xl'>
        <h1 className='h1'>{m.ops_matrixTitle()}</h1>
        <p className='mt-2 text-muted'>{m.ops_matrixSub()}</p>

        <Tabs className='mt-8' defaultValue='knowledge'>
          <Tabs.List>
            <Tabs.Tab value='knowledge'>{m.ops_matrixKnowledge()}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className='mt-6' value='knowledge'>
            <IntentCoverage coverage={knowledgeIntentCoverage} />
            <MatrixGrid
              className='mt-6'
              combos={knowledgeCombos}
              empty={knowledgeCombos.length === 0}
              items={knowledge}
            />
          </Tabs.Panel>
        </Tabs>

        <p className='mt-6 text-muted text-sm'>
          {m.ops_matrixLegendCovered()} = ✓ · {m.ops_matrixLegendGap()} = —
        </p>
      </div>
    </OpsShell>
  )
}

type IntentCoverageProps = {
  coverage: Record<string, number>
}

function IntentCoverage({ coverage }: IntentCoverageProps) {
  return (
    <div>
      <h2 className='h2'>{m.ops_matrixIntentCoverage()}</h2>
      <ul className='mt-3 flex flex-wrap gap-3'>
        {KNOWLEDGE_INTENTS.map(intent => (
          <li className='rounded-md border border-line px-3 py-1.5 font-mono text-sm' key={intent}>
            <span className='text-muted'>{intentLabel(intent)}</span>{' '}
            <span className='font-semibold'>{coverage[intent] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function intentLabel(intent: (typeof KNOWLEDGE_INTENTS)[number]): string {
  switch (intent) {
    case 'incident':
      return m.ops_intent_incident()
    case 'design':
      return m.ops_intent_design()
    case 'toolchain':
      return m.ops_intent_toolchain()
  }
}

type MatrixItem = { id: string; axisTags: string[] }

type MatrixGridProps = {
  combos: MatrixAxisCombo[]
  items: MatrixItem[]
  empty: boolean
  className?: string
}

function MatrixGrid({ combos, items, empty, className }: MatrixGridProps) {
  if (empty) {
    return <p className={`text-muted ${className ?? ''}`}>{m.ops_matrixEmpty()}</p>
  }

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
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

import type { ReactNode } from 'react'
import { OpsSideNav } from './OpsSideNav'

type OpsShellProps = {
  active: 'knowledge' | 'matrix'
  children: ReactNode
}

export function OpsShell({ active, children }: OpsShellProps) {
  return (
    <div className='ops-shell'>
      <OpsSideNav active={active} />
      <div className='min-w-0'>{children}</div>
    </div>
  )
}

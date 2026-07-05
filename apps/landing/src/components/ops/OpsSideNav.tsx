import { Link as RouterLink, useRouterState } from '@tanstack/react-router'
import { m } from '../../paraglide/messages.js'

type OpsSideNavProps = {
  active: 'runbooks' | 'guides' | 'matrix'
}

export function OpsSideNav({ active }: OpsSideNavProps) {
  const pathname = useRouterState({ select: s => s.location.pathname })

  const links = [
    { id: 'runbooks' as const, href: '/ops/runbooks', label: m.ops_nav_runbooks },
    { id: 'guides' as const, href: '/ops/guides', label: m.ops_nav_guides },
    { id: 'matrix' as const, href: '/ops/matrix', label: m.ops_nav_matrix },
  ]

  return (
    <aside className='ops-side-nav'>
      <p className='label-mono mb-4'>OPS CMS</p>
      <nav aria-label='Ops navigation'>
        <ul className='space-y-1'>
          {links.map(link => (
            <li key={link.id}>
              <RouterLink
                className={`ops-side-nav__link ${active === link.id || pathname.startsWith(link.href) ? 'ops-side-nav__link--active' : ''}`}
                to={link.href}
              >
                {link.label()}
              </RouterLink>
            </li>
          ))}
        </ul>
      </nav>
      <form action='/api/ops/auth/logout' className='mt-8' method='post'>
        <button className='ops-side-nav__link w-full text-start' type='submit'>
          {m.ops_nav_signOut()}
        </button>
      </form>
    </aside>
  )
}

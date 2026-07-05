import { Alert, Button } from '@polyms/core-ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { isOidcConfigured } from '../../lib/ops/oidc-config'
import { opsDevLoginFn } from '../../lib/ops/ops.auth.fns'
import { isOpsDevBypassEnabled } from '../../lib/ops/ops-env'
import { m } from '../../paraglide/messages.js'

type OpsLoginSearch = {
  returnTo: string
  error?: string
}

export const Route = createFileRoute('/ops/login')({
  validateSearch: (search: Record<string, unknown>): OpsLoginSearch => ({
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : '/ops/runbooks',
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  loader: () => ({
    oidcConfigured: isOidcConfigured(),
    devBypass: isOpsDevBypassEnabled(),
  }),
  component: OpsLoginPage,
})

function OpsLoginPage() {
  const { returnTo, error: callbackError } = Route.useSearch()
  const { oidcConfigured, devBypass } = Route.useLoaderData()
  const [error, setError] = useState<string | null>(callbackError ?? null)
  const [pending, setPending] = useState(false)

  const loginHref = `/api/ops/auth/login?returnTo=${encodeURIComponent(returnTo || '/ops/runbooks')}`

  async function devSignIn() {
    setPending(true)
    setError(null)
    try {
      await opsDevLoginFn()
      window.location.assign(returnTo || '/ops/runbooks')
    } catch {
      setError(m.ops_loginDevDisabled())
    } finally {
      setPending(false)
    }
  }

  return (
    <div className='page-x section-y mx-auto max-w-md text-center'>
      <h1 className='h1'>{m.ops_loginTitle()}</h1>
      <p className='mt-2 text-muted'>{m.ops_loginSub()}</p>

      {!oidcConfigured ? (
        <Alert className='mt-6 text-start' variant='warning'>
          {m.ops_loginOidcMissing()}
        </Alert>
      ) : null}

      {error ? (
        <Alert className='mt-6 text-start' variant='danger'>
          {error}
        </Alert>
      ) : null}

      <div className='mt-8 flex flex-col gap-3'>
        <Button
          disabled={!oidcConfigured}
          render={<a href={oidcConfigured ? loginHref : undefined} />}
          rounded
          size='lg'
          variant='primary'
        >
          {m.ops_loginCta()}
        </Button>

        {devBypass ? (
          <Button disabled={pending} onClick={devSignIn} rounded size='lg' variant='light'>
            {m.ops_loginDev()}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

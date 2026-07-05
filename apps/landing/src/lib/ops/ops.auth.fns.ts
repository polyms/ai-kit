import { createServerFn } from '@tanstack/react-start'
import { getRequest, setCookie } from '@tanstack/react-start/server'
import { isOpsDevBypassEnabled } from './ops-env'
import {
  createSessionToken,
  getSessionFromRequest,
  getSessionSubFromRequest,
  SESSION_COOKIE,
} from './session.server'

const SESSION_TTL_SEC = 24 * 60 * 60

export const getOpsSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const ok = getSessionFromRequest(request)
  return {
    ok,
    sub: ok ? getSessionSubFromRequest(request) : null,
  }
})

export const opsDevLoginFn = createServerFn({ method: 'POST' }).handler(async () => {
  if (!isOpsDevBypassEnabled()) {
    throw new Error('FORBIDDEN')
  }
  const token = createSessionToken('ops-dev')
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SEC,
    secure: process.env.NODE_ENV === 'production',
  })
  return { ok: true as const }
})

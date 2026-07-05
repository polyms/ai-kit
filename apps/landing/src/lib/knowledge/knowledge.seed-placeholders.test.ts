import { describe, expect, it } from 'vitest'
import { buildKN001 } from '../../../prisma/kn-001-data'
import { buildRB001 } from '../../../prisma/rb-001-data'
import {
  APP_ROOT,
  assertNoForbiddenSeedLiterals,
  collectAuthoringSeedText,
  DEV_ORIGIN,
  PROJECT,
  ROUTE_SEGMENT,
  TAILWIND_CONFIG_FILE,
} from '../../../prisma/seed-placeholders'
import { buildSG001 } from '../../../prisma/sg-001-data'

describe('knowledge seed placeholders', () => {
  const articles = [buildKN001(), buildRB001(), buildSG001()]

  it('uses shared path placeholders', () => {
    expect(PROJECT).toBe('{project}')
    expect(APP_ROOT).toBe('apps/{project}')
    expect(DEV_ORIGIN).toBe('http://localhost:{port}')
    expect(ROUTE_SEGMENT).toBe('{route}')
  })

  it('does not embed repo-specific literals in CMS seed prose', () => {
    expect(() => assertNoForbiddenSeedLiterals(collectAuthoringSeedText(articles), 'articles')).not.toThrow()
  })

  it('keeps KN-001 vscode settings free of repo-specific tailwind path', () => {
    const vscode = buildKN001().chunks.find(c => c.id === 'KN-001-vscode-settings')
    expect(vscode?.body).toContain(TAILWIND_CONFIG_FILE)
    expect(vscode?.body).not.toContain('apps/landing')
  })

  it('keeps RB-001 vercelignore issue generic', () => {
    const issue = buildRB001().chunks.find(c => c.id === 'RB-001-04')
    expect(issue?.symptom).toContain('/{route}/$id')
    expect(issue?.symptom).not.toContain('skills')
  })
})

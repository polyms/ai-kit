import { describe, expect, it } from 'vitest'
import { biomeJsonForKn001, buildKN001 } from '../../../prisma/kn-001-data'
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

  it('sanitizes KN-001 biome.json for CMS (apps/{project}, no kit globals)', () => {
    const body = biomeJsonForKn001()
    expect(body).toContain(`"${APP_ROOT}/**/*"`)
    expect(body).not.toContain('apps/landing')
    expect(body).not.toContain('__ORIGIN_POLYMS__')
    expect(() => assertNoForbiddenSeedLiterals(body, 'KN-001 biome.json')).not.toThrow()
    const biome = buildKN001().chunks.find(c => c.id === 'KN-001-biome-json')
    expect(biome?.body).toBe(body)
  })

  it('mirrors KN-001 checklist from checklist chunk items', () => {
    const article = buildKN001()
    const checklistChunk = article.chunks.find(c => c.id === 'KN-001-checklist')
    expect(article.checklist).toEqual(checklistChunk?.checklistItems)
    expect(article.checklist.length).toBeGreaterThan(0)
  })

  it('keeps RB-001 DATABASE_URL symptom free of kit route literals', () => {
    const issue = buildRB001().chunks.find(c => c.id === 'RB-001-05')
    expect(issue?.symptom).toContain('CMS-backed routes return 500')
    expect(issue?.symptom).not.toContain('/knowledge/')
    expect(issue?.symptom).not.toContain('/ops/')
  })

  it('keeps RB-001 vercelignore issue generic', () => {
    const issue = buildRB001().chunks.find(c => c.id === 'RB-001-04')
    expect(issue?.symptom).toContain('/{route}/$id')
    expect(issue?.symptom).not.toContain('skills')
  })
})

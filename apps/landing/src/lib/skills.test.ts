import { describe, expect, it } from 'vitest'
import type { SkillOverlay } from '../content/overlay'
import { getSkillCopy, getSkills } from './skills'

const skill: SkillOverlay = {
  name: 'demo',
  invoke: '/demo',
  slug: 'demo',
  description: { en: 'English description', vi: 'Mô tả tiếng Việt' },
  invocation: 'user',
  domain: 'design',
  githubPath: 'skills/demo/',
  summary: 'Same in both locales',
  pipeline: {
    upstream: { en: 'Idea', vi: 'Ý tưởng' },
    downstream: [{ en: 'Ship', vi: 'Ship' }, '/dev'],
  },
  agentPanel: {
    role: 'PRINCIPAL DEMO',
    owns: ['PRD', 'scope'],
    invokeHint: { en: 'Use the demo to ship', vi: 'Nhờ agent demo ship' },
  },
}

describe('getSkillCopy', () => {
  it('resolves localized fields to Vietnamese for vi locale', () => {
    const copy = getSkillCopy(skill, 'vi')

    expect(copy.description).toBe('Mô tả tiếng Việt')
    expect(copy.summary).toBe('Same in both locales')
    expect(copy.pipeline).toEqual({ upstream: 'Ý tưởng', downstream: ['Ship', '/dev'] })
    expect(copy.agentPanel).toEqual({
      role: 'PRINCIPAL DEMO',
      owns: ['PRD', 'scope'],
      invokeHint: 'Nhờ agent demo ship',
    })
  })

  it('resolves localized fields to English for en locale', () => {
    const copy = getSkillCopy(skill, 'en')

    expect(copy.description).toBe('English description')
    expect(copy.pipeline).toEqual({ upstream: 'Idea', downstream: ['Ship', '/dev'] })
    expect(copy.agentPanel?.role).toBe('PRINCIPAL DEMO')
    expect(copy.agentPanel?.invokeHint).toBe('Use the demo to ship')
  })

  it('leaves identity fields untouched regardless of locale', () => {
    const copy = getSkillCopy(skill, 'vi')

    expect(copy.invoke).toBe('/demo')
    expect(copy.slug).toBe('demo')
    expect(copy.name).toBe('demo')
  })
})

describe('skillOverlays catalog copy', () => {
  for (const locale of ['en', 'vi'] as const) {
    it(`gives every skill non-empty human-facing copy in ${locale}`, () => {
      const skills = getSkills(locale)

      expect(skills.length).toBeGreaterThan(0)

      for (const s of skills) {
        expect(s.description.trim().length, `${s.slug}.description`).toBeGreaterThan(20)
        expect(s.summary?.trim().length, `${s.slug}.summary`).toBeGreaterThan(20)
        expect(s.whenToUse?.trim().length, `${s.slug}.whenToUse`).toBeGreaterThan(20)
        expect(s.boundaries?.trim().length, `${s.slug}.boundaries`).toBeGreaterThan(20)
      }
    })
  }
})

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
  prerequisites: [
    { en: 'Bootstrap done', vi: 'Đã bootstrap' },
    { en: 'Spec ready', vi: 'Spec sẵn' },
  ],
  howTo: [
    { en: 'Invoke /demo', vi: 'Gọi /demo' },
    { en: 'Confirm outcome', vi: 'Xác nhận kết quả' },
  ],
  doneWhen: { en: 'Demo ships', vi: 'Demo đã ship' },
  tips: [{ en: 'Do not skip setup', vi: 'Đừng bỏ setup' }],
  samplePrompt: { en: '/demo\n\nShip the demo.', vi: '/demo\n\nShip demo này.' },
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
    expect(copy.prerequisites).toEqual(['Đã bootstrap', 'Spec sẵn'])
    expect(copy.howTo).toEqual(['Gọi /demo', 'Xác nhận kết quả'])
    expect(copy.doneWhen).toBe('Demo đã ship')
    expect(copy.tips).toEqual(['Đừng bỏ setup'])
    expect(copy.samplePrompt).toBe('/demo\n\nShip demo này.')
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
    expect(copy.prerequisites).toEqual(['Bootstrap done', 'Spec ready'])
    expect(copy.howTo?.[0]).toBe('Invoke /demo')
    expect(copy.doneWhen).toBe('Demo ships')
    expect(copy.samplePrompt).toBe('/demo\n\nShip the demo.')
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
        expect(s.prerequisites?.length, `${s.slug}.prerequisites`).toBeGreaterThan(0)
        expect(s.howTo?.length, `${s.slug}.howTo`).toBeGreaterThanOrEqual(3)
        expect(s.doneWhen?.trim().length, `${s.slug}.doneWhen`).toBeGreaterThan(20)
        for (const step of s.howTo ?? []) {
          expect(step.trim().length, `${s.slug}.howTo step`).toBeGreaterThan(10)
        }
      }
    })

    it(`gives main-path skills tips in ${locale}`, () => {
      const mainPath = new Set([
        'setup',
        'align',
        'reqs',
        'to-prd',
        'to-issues',
        'design',
        'dev',
        'code-review',
      ])
      for (const s of getSkills(locale)) {
        if (!mainPath.has(s.slug)) continue
        expect(s.tips?.length, `${s.slug}.tips`).toBeGreaterThan(0)
      }
    })
  }
})

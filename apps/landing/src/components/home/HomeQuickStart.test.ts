import { describe, expect, it } from 'vitest'
import { commandFromSelection } from './HomeQuickStart'

describe('commandFromSelection', () => {
  it('drops shell prompts so a drag-select paste is the command', () => {
    const raw = [
      '$ git clone \\',
      '> https://github.com/polyms/ai-kit',
      '$ cd ai-kit',
      '$ pnpm install',
      '$ pnpm bootstrap',
    ].join('\n')

    expect(commandFromSelection(raw)).toBe(
      [
        'git clone \\',
        'https://github.com/polyms/ai-kit',
        'cd ai-kit',
        'pnpm install',
        'pnpm bootstrap',
      ].join('\n')
    )
  })

  it('drops comment lines and a bare prompt', () => {
    expect(commandFromSelection('$ npx skills add \\\n# installs skills\n$ ')).toBe('npx skills add \\')
  })
})

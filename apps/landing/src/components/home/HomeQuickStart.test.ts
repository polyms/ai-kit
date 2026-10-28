import { describe, expect, it } from 'vitest'
import { commandFromSelection } from './HomeQuickStart'

describe('commandFromSelection', () => {
  it('drops shell prompts so a drag-select paste is the command', () => {
    const raw = [
      '$ npx skills add \\',
      '> https://github.com/polyms/ai-kit \\',
      "> --skill '*' -a cursor -g",
    ].join('\n')

    expect(commandFromSelection(raw)).toBe(
      ['npx skills add \\', 'https://github.com/polyms/ai-kit \\', "--skill '*' -a cursor -g"].join('\n')
    )
  })

  it('drops comment lines and a bare prompt', () => {
    expect(commandFromSelection('$ npx skills add \\\n# installs skills\n$ ')).toBe('npx skills add \\')
  })
})

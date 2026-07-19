import { describe, expect, it } from 'vitest'
import { tokenizeJson, tokenizeYaml } from './code-highlight'

function joined(tokens: { text: string }[]): string {
  return tokens.map(t => t.text).join('')
}

describe('tokenizeJson', () => {
  it('classifies keys, strings, numbers, keywords, and punctuation', () => {
    const code = '{\n  "name": "biome",\n  "count": 2,\n  "strict": true,\n  "extends": null\n}'
    const tokens = tokenizeJson(code)
    expect(joined(tokens)).toBe(code)
    expect(tokens.find(t => t.text === '"name"')?.type).toBe('key')
    expect(tokens.find(t => t.text === '"biome"')?.type).toBe('string')
    expect(tokens.find(t => t.text === '2')?.type).toBe('number')
    expect(tokens.find(t => t.text === 'true')?.type).toBe('keyword')
    expect(tokens.find(t => t.text === 'null')?.type).toBe('keyword')
    expect(tokens.find(t => t.text === '{')?.type).toBe('punct')
  })

  it('does not treat escaped quotes or colons inside strings as keys', () => {
    const tokens = tokenizeJson('{"a": "b: \\"c\\""}')
    expect(tokens.find(t => t.text === '"a"')?.type).toBe('key')
    expect(tokens.find(t => t.text === '"b: \\"c\\""')?.type).toBe('string')
  })
})

describe('tokenizeYaml', () => {
  it('classifies keys, scalars, and sequence markers', () => {
    const code = 'name: biome\ncount: 2\nstrict: true\ntags:\n  - lint\n  - format'
    const tokens = tokenizeYaml(code)
    expect(joined(tokens)).toBe(code)
    expect(tokens.find(t => t.text === 'name')?.type).toBe('key')
    expect(tokens.find(t => t.text === 'biome')?.type).toBe('string')
    expect(tokens.find(t => t.text === '2')?.type).toBe('number')
    expect(tokens.find(t => t.text === 'true')?.type).toBe('keyword')
    expect(tokens.filter(t => t.text === '- ').every(t => t.type === 'punct')).toBe(true)
  })

  it('treats block scalar bodies as strings', () => {
    const code = 'script: |\n  echo one\n  echo two\nnext: 1'
    const tokens = tokenizeYaml(code)
    expect(joined(tokens)).toBe(code)
    expect(tokens.find(t => t.text === '  echo one')?.type).toBe('string')
    expect(tokens.find(t => t.text === 'next')?.type).toBe('key')
  })

  it('keeps comments and quoted keys intact', () => {
    const code = '# config\n"a:b": value'
    const tokens = tokenizeYaml(code)
    expect(joined(tokens)).toBe(code)
    expect(tokens.find(t => t.text === '# config')?.type).toBe('comment')
    expect(tokens.find(t => t.text === '"a:b"')?.type).toBe('key')
  })
})

export type CodeTokenType = 'key' | 'string' | 'number' | 'keyword' | 'punct' | 'comment' | 'plain'

export type CodeToken = {
  type: CodeTokenType
  text: string
}

const JSON_PATTERN =
  /("(?:\\.|[^"\\])*")(\s*:)|("(?:\\.|[^"\\])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])/g

export function tokenizeJson(code: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let last = 0
  for (const match of code.matchAll(JSON_PATTERN)) {
    if (match.index > last) tokens.push({ type: 'plain', text: code.slice(last, match.index) })
    const [full, key, keyColon, str, num, keyword] = match
    if (key !== undefined && keyColon !== undefined) {
      tokens.push({ type: 'key', text: key }, { type: 'punct', text: keyColon })
    } else if (str !== undefined) {
      tokens.push({ type: 'string', text: str })
    } else if (num !== undefined) {
      tokens.push({ type: 'number', text: num })
    } else if (keyword !== undefined) {
      tokens.push({ type: 'keyword', text: keyword })
    } else {
      tokens.push({ type: 'punct', text: full })
    }
    last = match.index + full.length
  }
  if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) })
  return tokens
}

const YAML_KEY_PATTERN = /^("(?:\\.|[^"\\])*"|'[^']*'|[^:\s][^:]*?):(?=\s|$)/
const YAML_NUMBER_PATTERN = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/
const YAML_BLOCK_PATTERN = /^[|>][+-]?$/

function yamlScalarType(value: string): CodeTokenType {
  if (value.startsWith('"') || value.startsWith("'")) return 'string'
  if (YAML_NUMBER_PATTERN.test(value)) return 'number'
  if (value === 'true' || value === 'false' || value === 'null' || value === '~') return 'keyword'
  return 'string'
}

export function tokenizeYaml(code: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let blockIndent: number | undefined
  code.split('\n').forEach((line, lineIndex) => {
    if (lineIndex > 0) tokens.push({ type: 'plain', text: '\n' })
    const indent = line.length - line.trimStart().length
    if (blockIndent !== undefined) {
      if (line.trim() === '' || indent > blockIndent) {
        tokens.push({ type: 'string', text: line })
        return
      }
      blockIndent = undefined
    }
    const trimmed = line.trim()
    if (trimmed === '') {
      if (line !== '') tokens.push({ type: 'plain', text: line })
      return
    }
    if (trimmed.startsWith('#')) {
      tokens.push({ type: 'comment', text: line })
      return
    }
    let rest = line
    if (indent > 0) {
      tokens.push({ type: 'plain', text: line.slice(0, indent) })
      rest = line.slice(indent)
    }
    while (rest.startsWith('- ') || rest === '-') {
      tokens.push({ type: 'punct', text: rest === '-' ? '-' : '- ' })
      rest = rest === '-' ? '' : rest.slice(2)
    }
    const keyMatch = rest.match(YAML_KEY_PATTERN)
    if (keyMatch) {
      tokens.push({ type: 'key', text: keyMatch[1] }, { type: 'punct', text: ':' })
      rest = rest.slice(keyMatch[0].length)
    }
    if (rest === '') return
    const spaces = rest.length - rest.trimStart().length
    if (spaces > 0) {
      tokens.push({ type: 'plain', text: rest.slice(0, spaces) })
      rest = rest.slice(spaces)
    }
    if (YAML_BLOCK_PATTERN.test(rest)) {
      tokens.push({ type: 'punct', text: rest })
      blockIndent = indent
      return
    }
    tokens.push({ type: yamlScalarType(rest), text: rest })
  })
  return tokens
}

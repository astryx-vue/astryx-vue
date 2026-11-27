/**
 * The module specifiers a Vue single-file component really imports: the ones
 * its `<script>` blocks name in an `import` or `export ... from` statement or a
 * dynamic `import()`. A specifier that only appears in a comment, a string such
 * as a code sample, or the `<template>` is text, not a dependency.
 */
export function importedSpecifiers(source: string): string[] {
  const found = new Set<string>()
  for (const block of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))
    scanScript(block[1] ?? '', found)
  return [...found]
}

function scanScript(code: string, found: Set<string>): void {
  let previous = ''
  let beforePrevious = ''
  const push = (token: string): void => {
    beforePrevious = previous
    previous = token
  }
  let index = 0
  while (index < code.length) {
    const character = code[index]!
    const next = code[index + 1]
    if (character === '/' && next === '/') {
      const end = code.indexOf('\n', index)
      index = end === -1 ? code.length : end
      continue
    }
    if (character === '/' && next === '*') {
      const end = code.indexOf('*/', index + 2)
      index = end === -1 ? code.length : end + 2
      continue
    }
    if (character === '"' || character === '\'') {
      const { value, end } = readString(code, index, character)
      const importing = previous === 'from' || previous === 'import' || (previous === '(' && beforePrevious === 'import')
      if (importing)
        found.add(value)
      push('"')
      index = end
      continue
    }
    if (character === '`') {
      index = skipTemplateLiteral(code, index)
      push('`')
      continue
    }
    if (/[\w$]/.test(character)) {
      let end = index
      while (end < code.length && /[\w$]/.test(code[end]!))
        end += 1
      push(code.slice(index, end))
      index = end
      continue
    }
    if (!/\s/.test(character))
      push(character)
    index += 1
  }
}

function readString(code: string, start: number, quote: string): { value: string, end: number } {
  let index = start + 1
  let value = ''
  while (index < code.length && code[index] !== quote && code[index] !== '\n') {
    if (code[index] === '\\') {
      value += code[index + 1] ?? ''
      index += 2
      continue
    }
    value += code[index]
    index += 1
  }
  return { value, end: index + 1 }
}

/** Past the closing backtick, stepping over `${...}` parts and escapes. */
function skipTemplateLiteral(code: string, start: number): number {
  let index = start + 1
  while (index < code.length && code[index] !== '`') {
    if (code[index] === '\\') {
      index += 2
      continue
    }
    if (code[index] === '$' && code[index + 1] === '{') {
      let depth = 1
      index += 2
      while (index < code.length && depth > 0) {
        if (code[index] === '{')
          depth += 1
        else if (code[index] === '}')
          depth -= 1
        index += 1
      }
      continue
    }
    index += 1
  }
  return index + 1
}

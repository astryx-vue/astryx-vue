/**
 * @file tokenReferences.ts
 * @input A flat map of token names to raw CSS values
 * @output `resolveTokenReferences`, which follows `var(--name[, fallback])`
 *   references through the map
 * @position Theme utility with no imports: themeMotion.ts resolves motion
 *   tokens written as references on it, and the motion foundation resolves
 *   the declared timing defaults on it. Pure; safe on the server.
 */

/**
 * Call `visit` for each top-level character of a CSS value. A top-level
 * character is outside parentheses and outside quoted strings. In a quoted
 * string, a backslash escapes the next character. The scan stops when `visit`
 * returns true.
 */
function scanTopLevel(input: string, visit: (index: number) => boolean): void {
  let depth = 0
  let quote: '"' | '\'' | null = null
  let isEscaped = false
  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (quote !== null) {
      if (isEscaped)
        isEscaped = false
      else if (char === '\\')
        isEscaped = true
      else if (char === quote)
        quote = null
      continue
    }
    if (char === '"' || char === '\'') {
      quote = char
      continue
    }
    if (char === '(') {
      depth++
      continue
    }
    if (char === ')') {
      depth = Math.max(0, depth - 1)
      continue
    }
    if (depth === 0 && visit(i))
      return
  }
}

/**
 * Split the arguments of a CSS function body on the first top-level comma.
 * Handles nested functions such as rgba(), color-mix(), var(), and quoted strings.
 */
function splitTopLevelComma(input: string): [string, string] | null {
  let split: [string, string] | null = null
  scanTopLevel(input, (i) => {
    if (input[i] !== ',')
      return false
    split = [input.slice(0, i).trim(), input.slice(i + 1).trim()]
    return true
  })
  return split
}

/** Index of the `)` matching the `(` at `openIndex`, or -1 when unbalanced. */
function findMatchingParen(input: string, openIndex: number): number {
  let depth = 0
  for (let i = openIndex; i < input.length; i++) {
    const char = input[i]
    if (char === '(') {
      depth++
    }
    else if (char === ')') {
      depth--
      if (depth === 0)
        return i
    }
  }
  return -1
}

/**
 * Resolves every value in `raw` to a concrete one: each `var(--name[,
 * fallback])` is replaced by `name`'s resolved value, or by its fallback when
 * `raw` has no `name`, and is kept as written when neither exists or the
 * references form a cycle.
 */
export function resolveTokenReferences(raw: Readonly<Record<string, string>>): Record<string, string> {
  const cache: Record<string, string> = {}

  // `seen` tracks the reference chain, so a cycle resolves to the literal
  // reference instead of recursing forever.
  const substitute = (expr: string, seen: Set<string>): string => {
    const start = expr.indexOf('var(')
    if (start === -1)
      return expr
    const openIndex = start + 'var'.length
    const closeIndex = findMatchingParen(expr, openIndex)
    if (closeIndex === -1)
      return expr
    const inner = expr.slice(openIndex + 1, closeIndex)
    const commaSplit = splitTopLevelComma(inner)
    const name = (commaSplit ? commaSplit[0] : inner).trim()
    const fallback = commaSplit ? commaSplit[1] : null
    let replacement: string
    if (seen.has(name)) {
      replacement = expr.slice(start, closeIndex + 1)
    }
    else if (name in raw) {
      seen.add(name)
      // eslint-disable-next-line ts/no-use-before-define -- 两个函数互相递归，调用时都已定义
      replacement = reference(name, seen)
      seen.delete(name)
    }
    else if (fallback !== null) {
      replacement = substitute(fallback.trim(), seen)
    }
    else {
      replacement = expr.slice(start, closeIndex + 1)
    }
    const rest = substitute(expr.slice(closeIndex + 1), seen)
    return expr.slice(0, start) + replacement + rest
  }

  const reference = (name: string, seen: Set<string>): string => {
    if (name in cache)
      return cache[name]!
    const value = raw[name]
    if (value === undefined)
      return ''
    const resolved = value.includes('var(') ? substitute(value, seen) : value
    cache[name] = resolved
    return resolved
  }

  for (const name of Object.keys(raw))
    reference(name, new Set<string>())
  return cache
}

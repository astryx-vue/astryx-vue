/**
 * Whether one theme value can be written as exactly one CSS declaration.
 *
 * Theme objects are code, but apps also build them from stored input such as
 * brand colors. A value that closes the rule, opens a block, or ends the
 * declaration early would let one entry write CSS the theme never meant to.
 *
 * The checks follow CSS tokenization, so valid CSS a browser keeps inside one
 * declaration is accepted: a `;` inside a quoted string or a quoted `url()`,
 * an escaped character such as `Gill\ Sans`, and a closed comment. Rejected:
 * a top-level `;`, an unmatched bracket, an unclosed string, comment, or
 * `url(`, and a trailing backslash.
 *
 * Each check returns `null` when the input is safe, or a short reason.
 */

function isNewline(ch: string | undefined): boolean {
  return ch === '\n' || ch === '\r' || ch === '\f'
}

function isWhitespace(ch: string | undefined): boolean {
  return ch === ' ' || ch === '\t' || isNewline(ch)
}

function isHexDigit(ch: string | undefined): boolean {
  return ch != null && /^[0-9a-f]$/i.test(ch)
}

function isNameStart(ch: string | undefined): boolean {
  return ch != null && (/^[a-z_]$/i.test(ch) || ch.charCodeAt(0) >= 0x80)
}

function isNameChar(ch: string | undefined): boolean {
  return isNameStart(ch) || (ch != null && /^[0-9-]$/.test(ch))
}

function preprocess(input: string): string {
  return input.replace(/\r\n?|\f/g, '\n').replace(/\0/g, '\uFFFD')
}

// eslint-disable-next-line no-control-regex
const NON_PRINTABLE = /[\x01-\x08\v\x0E-\x1F\x7F]/

function isValidEscape(input: string, pos: number): boolean {
  return input[pos] === '\\' && pos + 1 < input.length && !isNewline(input[pos + 1])
}

function startsIdent(input: string, pos: number): boolean {
  const ch = input[pos]
  if (ch === '-') {
    const next = input[pos + 1]
    return next === '-' || isNameStart(next) || isValidEscape(input, pos + 1)
  }
  if (ch === '\\')
    return isValidEscape(input, pos)
  return isNameStart(ch)
}

/** Index just past an escape whose backslash sits at `pos - 1`. */
function consumeEscape(input: string, pos: number): number {
  if (isHexDigit(input[pos])) {
    let end = pos
    while (end < input.length && end - pos < 6 && isHexDigit(input[end]))
      end += 1
    return isWhitespace(input[end]) ? end + 1 : end
  }
  const code = input.codePointAt(pos) ?? 0
  return pos + (code > 0xFFFF ? 2 : 1)
}

function consumeIdent(input: string, pos: number): { end: number, name: string } {
  let name = ''
  let i = pos
  while (i < input.length) {
    const ch = input[i] ?? ''
    if (isNameChar(ch)) {
      name += ch
      i += 1
    }
    else if (isValidEscape(input, i)) {
      const end = consumeEscape(input, i + 1)
      name += input.slice(i + 1, end).trim()
      i = end
    }
    else {
      break
    }
  }
  return { end: i, name }
}

type Scan = { end: number } | { reason: string }

function consumeString(input: string, pos: number): Scan {
  const quote = input[pos]
  let i = pos + 1
  while (i < input.length) {
    const ch = input[i]
    if (ch === quote)
      return { end: i + 1 }
    if (isNewline(ch))
      return { reason: 'a newline inside a quoted string makes a bad string' }
    if (ch === '\\') {
      if (i + 1 >= input.length)
        break
      i = isNewline(input[i + 1]) ? i + 2 : consumeEscape(input, i + 1)
      continue
    }
    i += 1
  }
  return { reason: `an unclosed ${quote} string would swallow the rest of the rule` }
}

function consumeUrl(input: string, pos: number): Scan {
  let i = pos
  while (i < input.length) {
    const ch = input[i] ?? ''
    if (ch === ')')
      return { end: i + 1 }
    if (isWhitespace(ch)) {
      while (i < input.length && isWhitespace(input[i]))
        i += 1
      if (i >= input.length)
        break
      if (input[i] === ')')
        return { end: i + 1 }
      return { reason: 'whitespace inside an unquoted url() makes a bad url' }
    }
    if (NON_PRINTABLE.test(ch))
      return { reason: 'a non-printable character inside url() makes a bad url' }
    if (ch === '"' || ch === '\'' || ch === '(')
      return { reason: `"${ch}" inside an unquoted url() makes a bad url; quote the URL instead` }
    if (ch === '\\') {
      if (!isValidEscape(input, i))
        return { reason: 'a stray backslash inside url() makes a bad url' }
      i = consumeEscape(input, i + 1)
      continue
    }
    i += 1
  }
  return { reason: 'an unclosed url( would swallow the rest of the rule' }
}

const CLOSER: Record<string, string> = { '(': ')', '[': ']', '{': '}' }
const OPENER: Record<string, string> = { ')': '(', ']': '[', '}': '{' }

/** Why `input` cannot be the value of one declaration, or `null` when it can. */
export function checkDeclarationValue(input: string): string | null {
  const value = preprocess(input)
  const open: string[] = []
  let i = 0
  while (i < value.length) {
    const ch = value[i] ?? ''

    if (ch === '/' && value[i + 1] === '*') {
      const close = value.indexOf('*/', i + 2)
      if (close === -1)
        return 'an unclosed /* comment would swallow the rest of the rule'
      i = close + 2
      continue
    }

    if (ch === '"' || ch === '\'') {
      const scanned = consumeString(value, i)
      if ('reason' in scanned)
        return scanned.reason
      i = scanned.end
      continue
    }

    if (startsIdent(value, i)) {
      const ident = consumeIdent(value, i)
      i = ident.end
      if (value[i] === '(' && ident.name.toLowerCase() === 'url') {
        let j = i + 1
        while (j < value.length && isWhitespace(value[j]))
          j += 1
        if (value[j] === '"' || value[j] === '\'') {
          open.push(')')
          i += 1
          continue
        }
        const scanned = consumeUrl(value, j)
        if ('reason' in scanned)
          return scanned.reason
        i = scanned.end
      }
      continue
    }

    if (ch === '\\') {
      if (i + 1 >= value.length)
        return 'a trailing backslash would escape the declaration terminator'
      i = isNewline(value[i + 1]) ? i + 1 : consumeEscape(value, i + 1)
      continue
    }

    if (ch in CLOSER) {
      if (ch === '{' && open.length === 0)
        return 'an unquoted "{" would open a nested block'
      open.push(CLOSER[ch] ?? '')
      i += 1
      continue
    }

    if (ch in OPENER) {
      if (open.length === 0) {
        return ch === '}'
          ? 'an unquoted "}" would close the rule'
          : `an unbalanced "${ch}" has nothing to close`
      }
      const expected = open.pop()
      if (expected !== ch)
        return `"${ch}" does not close the open "${OPENER[expected ?? ''] ?? ''}"`
      i += 1
      continue
    }

    if (ch === ';' && open.length === 0)
      return 'an unquoted ";" would end the declaration'

    i += 1
  }

  const closer = open[open.length - 1]
  if (closer != null)
    return `an unclosed "${OPENER[closer]}" would swallow the rest of the rule`
  return null
}

/** Shorten a value for a one-line message. */
function previewValue(value: string): string {
  const oneLine = JSON.stringify(value)
  return oneLine.length > 80 ? `${oneLine.slice(0, 77)}..."` : oneLine
}

/**
 * Report one dropped declaration. The theme keeps every other declaration,
 * so a bad brand color from stored input cannot blank the whole theme.
 */
export function warnDroppedDeclaration(property: string, value: string, location: string, reason: string): void {
  if (typeof console === 'undefined')
    return
  console.warn(`[astryx theme] dropped "${property}" in ${location}: ${reason} (value: ${previewValue(value)})`)
}

/**
 * Why `input` cannot be a declaration's property name, or `null` when it can.
 * A property name is one CSS identifier: `color`, `-webkit-line-clamp`, or a
 * custom property such as `--brand-accent`.
 */
export function checkDeclarationName(input: string): string | null {
  const name = preprocess(input)
  if (name.length === 0 || !startsIdent(name, 0))
    return 'a property name must be a CSS identifier'
  const { end } = consumeIdent(name, 0)
  if (end !== name.length)
    return `a property name must be one CSS identifier; "${name[end]}" cannot appear in one`
  return null
}

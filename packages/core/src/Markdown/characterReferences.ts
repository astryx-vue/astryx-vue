import { NAMED_CHARACTER_REFERENCES } from './namedCharacterReferences.js'

let namedReferences: Map<string, string> | undefined

function namedReference(name: string): string | undefined {
  if (namedReferences == null) {
    namedReferences = new Map()
    for (const entry of NAMED_CHARACTER_REFERENCES.split(' ')) {
      const separator = entry.indexOf('=')
      if (separator <= 0)
        continue
      const characters = String.fromCodePoint(
        ...entry.slice(separator + 1).split(',').map(hex => Number.parseInt(hex, 16)),
      )
      namedReferences.set(entry.slice(0, separator), characters)
    }
  }
  return namedReferences.get(name)
}

const CHARACTER_REFERENCE = /^&(?:#x([0-9a-f]{1,6})|#(\d{1,7})|([A-Z][A-Z0-9]{0,31}));/i

/**
 * A character reference at `start`, or null when that slice is not one.
 * Unknown names, a missing semicolon, and over-long numbers are not references.
 */
export function matchCharacterReference(
  text: string,
  start: number,
): { value: string, end: number } | null {
  const match = CHARACTER_REFERENCE.exec(text.slice(start, start + 40))
  if (match == null)
    return null
  const [reference, hex, decimal, name] = match
  const end = start + reference.length
  if (name != null) {
    const value = namedReference(name)
    return value == null ? null : { value, end }
  }
  const codePoint = hex != null ? Number.parseInt(hex, 16) : Number.parseInt(decimal ?? '0', 10)
  const isValid = codePoint !== 0
    && codePoint <= 0x10FFFF
    && (codePoint < 0xD800 || codePoint > 0xDFFF)
  return { value: isValid ? String.fromCodePoint(codePoint) : '\uFFFD', end }
}

/**
 * Replace every valid character reference in plain text.
 * `&copy;`, `&#169;`, and `&#xA9;` all become `©`.
 * An unknown name, or a reference without `;`, stays as written.
 * This function does not know about Markdown, so leave code and
 * backslash-escaped references out of `text`.
 */
export function decodeMarkdownCharacterReferences(text: string): string {
  let output = ''
  let index = 0
  let ampersand = text.indexOf('&')
  while (ampersand !== -1) {
    const reference = matchCharacterReference(text, ampersand)
    if (reference == null) {
      ampersand = text.indexOf('&', ampersand + 1)
      continue
    }
    output += text.slice(index, ampersand) + reference.value
    index = reference.end
    ampersand = text.indexOf('&', index)
  }
  return index === 0 ? text : output + text.slice(index)
}

/** Every ASCII punctuation character, the set a backslash can escape. */
const ASCII_PUNCTUATION = new Set('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')

/**
 * Plain text with its backslash escapes and character references read:
 * `\\*` is `*`, `&copy;` is `©`. Text that holds neither is returned as is.
 */
export function decodeLiteralText(text: string): string {
  if (!text.includes('\\') && !text.includes('&'))
    return text
  let output = ''
  let index = 0
  while (index < text.length) {
    const character = text[index] as string
    if (character === '\\' && index + 1 < text.length && ASCII_PUNCTUATION.has(text[index + 1] as string)) {
      output += text[index + 1]
      index += 2
      continue
    }
    if (character === '&') {
      const reference = matchCharacterReference(text, index)
      if (reference != null) {
        output += reference.value
        index = reference.end
        continue
      }
    }
    output += character
    index++
  }
  return output
}

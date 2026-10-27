// 私用区字符占位（stand-in）的共同体：占位替换了什么、一次扫描里哪些私用字符还没被占用。

/**
 * What a stand-in replaced: a reference as written, an escaped `&`, or a
 * backslash-escaped character.
 */
export type StandIn
  = | { readonly kind: 'reference', readonly source: string }
    | { readonly kind: 'ampersand' }
    | { readonly kind: 'escape', readonly character: string }
    | { readonly kind: 'backslash' }
    | { readonly kind: 'literal', readonly text: string }

export interface ProtectedMarkdown {
  /** The source with stand-ins in place of references. */
  readonly markdown: string
  /** What each stand-in replaced. */
  readonly standIns: ReadonlyMap<string, StandIn>
}

const PRIVATE_USE_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0xE000, 0xF8FF],
  [0xF0000, 0xFFFFD],
  [0x100000, 0x10FFFD],
]

/** Private-use characters that do not occur in `text`, in order. */
export function* absentCharacters(text: string): Generator<string> {
  const present = new Set(text)
  for (const [first, last] of PRIVATE_USE_RANGES) {
    for (let codePoint = first; codePoint <= last; codePoint++) {
      const character = String.fromCodePoint(codePoint)
      if (!present.has(character)) {
        yield character
      }
    }
  }
}

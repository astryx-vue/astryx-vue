/** One grammar rule: text matching `regex` paints as `type`. */
export interface GrammarPattern { type: string, regex: RegExp }

/** A language's rules, tried in order at each position. */
export interface Grammar {
  patterns: GrammarPattern[]
  /** SyntaxToken type that matches the element's default text color (skipped in output). */
  defaultType: string
}

const LANGUAGE = Symbol.for('astryx.codeLanguage')

/** A flat token from a custom tokenize function: absolute offsets in `code`. */
export interface CodeLanguageToken { type: string, start: number, end: number }

/** A custom language's tokenize function, the shape `tokenizer` takes. */
export type CodeLanguageTokenize = (
  code: string,
  language: string,
) => CodeLanguageToken[]

/**
 * A language value: an Astryx module from
 * `@astryx-vue/core/Code/languages/<name>`, or a custom language from
 * `createCodeLanguage`. Pass it as `language`, or list it in `codeLanguages`
 * on Markdown and RichTextEditor.
 */
export interface CodeLanguage {
  /** The identifier the label shows, such as `graphql`; shown verbatim. */
  readonly name: string
  /** The words that name this language in `language` strings and fences. */
  readonly identifiers: ReadonlyArray<string>
  /** File extensions (no dot) that infer this language, such as `graphql`. */
  readonly fileExtensions: ReadonlyArray<string>
  /** Whole file names that infer this language, such as `Dockerfile`. */
  readonly fileNames: ReadonlyArray<string>
  readonly [LANGUAGE]: true
}

/** How a language value paints: Astryx grammar data or a custom function. */
export type CodeLanguagePainter
  = | { kind: 'grammar', grammar: Grammar }
    | { kind: 'tokenize', tokenize: CodeLanguageTokenize }

type InternalCodeLanguage = CodeLanguage & {
  readonly painter: () => CodeLanguagePainter
}

interface CodeLanguageMeta {
  name: string
  identifiers: ReadonlyArray<string>
  fileExtensions?: ReadonlyArray<string>
  fileNames?: ReadonlyArray<string>
}

function makeLanguage(
  meta: CodeLanguageMeta,
  painter: () => CodeLanguagePainter,
): CodeLanguage {
  const language: InternalCodeLanguage = {
    name: meta.name,
    identifiers: meta.identifiers,
    fileExtensions: meta.fileExtensions ?? [],
    fileNames: meta.fileNames ?? [],
    [LANGUAGE]: true,
    painter,
  }
  return language
}

/** Make an Astryx language module from grammar data. Internal. */
export function defineCodeLanguage(
  meta: CodeLanguageMeta,
  grammar: () => Grammar,
): CodeLanguage {
  return makeLanguage(meta, () => ({ kind: 'grammar', grammar: grammar() }))
}

export type CreateCodeLanguageOptions = CodeLanguageMeta & {
  /** Returns the tokens of `code`; runs synchronously. */
  tokenize: CodeLanguageTokenize
}

/**
 * Make a custom language value from your own tokenize function. It works
 * everywhere an Astryx language module does: as `language`, and in
 * `codeLanguages` on Markdown and RichTextEditor.
 *
 * @example
 * ```
 * const zig = createCodeLanguage({
 *   name: 'zig',
 *   identifiers: ['zig'],
 *   fileExtensions: ['zig'],
 *   tokenize: zigTokens,
 * });
 * <CodeBlock :language="zig" :code="source" />
 * ```
 */
export function createCodeLanguage({
  tokenize,
  ...meta
}: CreateCodeLanguageOptions): CodeLanguage {
  return makeLanguage(meta, () => ({ kind: 'tokenize', tokenize }))
}

/** Whether `value` is a language value. */
export function isCodeLanguage(value: unknown): value is CodeLanguage {
  return (
    typeof value === 'object'
    && value !== null
    && (value as Partial<CodeLanguage>)[LANGUAGE] === true
  )
}

/** How a language value paints, or null for any other value. */
export function codeLanguagePainter(
  language: CodeLanguage,
): CodeLanguagePainter | null {
  const internal = language as Partial<InternalCodeLanguage>
  return isCodeLanguage(language) && typeof internal.painter === 'function'
    ? internal.painter()
    : null
}

/**
 * Whether `language` is a custom language (made with `createCodeLanguage`),
 * whose function runs synchronously at any length, as `tokenizer` does.
 */
export function isCustomCodeLanguage(language: string | CodeLanguage): boolean {
  return (
    typeof language !== 'string'
    && codeLanguagePainter(language)?.kind === 'tokenize'
  )
}

/** The word a language reflects and labels: a string itself, or a value's name. */
export function languageLabel(language: string | CodeLanguage): string {
  return typeof language === 'string' ? language : language.name
}

/** The word a language reflects as `data-language`: its first identifier. */
export function languageKey(language: string | CodeLanguage): string {
  return typeof language === 'string'
    ? language
    : (language.identifiers[0] ?? language.name)
}

/** The listed value that claims `word`; a later entry wins. */
export function listedLanguage(
  languages: ReadonlyArray<CodeLanguage> | undefined,
  word: string,
): CodeLanguage | undefined {
  if (languages == null) {
    return undefined
  }
  for (let i = languages.length - 1; i >= 0; i--) {
    if (languages[i].identifiers.includes(word)) {
      return languages[i]
    }
  }
  return undefined
}

/** The listed value a file's name or extension infers; a later entry wins. */
export function listedLanguageForFile(
  languages: ReadonlyArray<CodeLanguage> | undefined,
  fileName: string,
  extension: string | null,
): CodeLanguage | undefined {
  if (languages == null) {
    return undefined
  }
  for (let i = languages.length - 1; i >= 0; i--) {
    const language = languages[i]
    if (
      language.fileNames.includes(fileName)
      || (extension != null && language.fileExtensions.includes(extension))
    ) {
      return language
    }
  }
  return undefined
}

/** Whether two lists name the same values in the same order. */
export function sameCodeLanguageList(
  a: ReadonlyArray<CodeLanguage> | undefined,
  b: ReadonlyArray<CodeLanguage> | undefined,
): boolean {
  if (a === b) {
    return true
  }
  if (a == null || b == null || a.length !== b.length) {
    return false
  }
  return a.every((language, i) => language === b[i])
}

/** A keyword alternation from a space-separated word list. */
export function keywords(words: string): RegExp {
  return new RegExp(`\\b(?:${words.trim().split(/\s+/).join('|')})\\b`)
}

// 数字字面量后面可跟类型后缀（`10u32`、`0xFFn`），后缀是同一行里的一小段字母，回溯量有限。
// eslint-disable-next-line regexp/no-super-linear-backtracking -- 同上。
export const NUMBER = /\b(?:0x[\da-f_]+|0b[01_]+|0o[0-7_]+|\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d+)?)[a-z]*\b/i
export const DOUBLE_QUOTED = /"(?:[^"\\\n]|\\.)*"/
export const SINGLE_QUOTED = /'(?:[^'\\\n]|\\.)*'/
export const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//
export const LINE_COMMENT = /\/\/[^\n]*/
export const HASH_COMMENT = /#[^\n]*/
export const CALL = /\b[a-z_$][\w$]*(?=\s*\()/i
export const TYPE_NAME = /\b[A-Z]\w*\b/
export const OPERATOR = /[+\-*/%=!<>&|^~?:]+/

export const PUNCTUATION = /[{}()[\];,.@]/

/**
 * A C-like grammar: comments, any extra rules, strings, numbers, keywords,
 * calls, type names, operators, and punctuation, in that order.
 */
export function cLike(
  words: string,
  extra: GrammarPattern[] = [],
  comments: RegExp[] = [BLOCK_COMMENT, LINE_COMMENT],
): Grammar {
  return {
    defaultType: 'variable',
    patterns: [
      ...comments.map(regex => ({ type: 'comment', regex })),
      ...extra,
      { type: 'string', regex: DOUBLE_QUOTED },
      { type: 'string', regex: SINGLE_QUOTED },
      { type: 'number', regex: NUMBER },
      { type: 'keyword', regex: keywords(words) },
      { type: 'function', regex: CALL },
      { type: 'type', regex: TYPE_NAME },
      { type: 'operator', regex: OPERATOR },
      { type: 'punctuation', regex: PUNCTUATION },
    ],
  }
}

/** A preprocessor directive at the start of a line (`#include`). */
export const DIRECTIVE = /^[ \t]*#\s*\w+/m

export const C_WORDS
  = 'auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while bool true false NULL nullptr'

export const CPP_WORDS = `${C_WORDS} alignas alignof catch class concept constexpr consteval co_await co_return co_yield decltype delete explicit export friend mutable namespace new noexcept operator override private protected public requires static_assert template this throw try typename using virtual final`

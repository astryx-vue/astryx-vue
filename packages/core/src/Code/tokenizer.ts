import type { SyntaxToken, TokenLine } from './types.js'

declare const scheduler: { yield?: () => Promise<void> } | undefined

interface LanguagePattern {
  regex: RegExp
  type: string
}

interface LanguageDefinition {
  patterns: (LanguagePattern & { anchored: RegExp })[]
  defaultType: string
}

/** Token offsets are relative to the start of their line. */
interface LanguagePatterns { patterns: LanguagePattern[], defaultType: string }

const langCache = new Map<string, LanguageDefinition | null>()

const JS_KEYWORDS = /\b(const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|throw|new|typeof|instanceof|interface|type|enum|extends|implements|switch|case|break|continue|do|in|of|void|null|undefined|true|false|this|super|yield|delete|static|public|private|protected|readonly|abstract|as|is|keyof|declare|module|namespace|require)\b/
const PYTHON_KEYWORDS = /\b(def|class|if|elif|else|for|while|return|import|from|as|with|try|except|raise|True|False|None|and|or|not|in|is|lambda|yield|async|await|pass|break|continue|del|global|nonlocal|assert|finally|print|self|cls)\b/
const BASH_KEYWORDS = /\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|in|select|return|exit|local|export|source|alias|unalias|readonly|shift|eval|exec|set|unset|trap|wait|read|echo|printf|test|true|false)\b/
const CSS_KEYWORDS = /\b(important|inherit|initial|unset|revert|auto|none)\b/
const PHP_KEYWORDS = /\b(function|class|if|else|elseif|for|foreach|while|return|echo|public|private|protected|static|new|try|catch|throw|namespace|use|require|require_once|include|include_once|extends|implements|interface|abstract|final|const|var|true|false|null|array|isset|unset|empty|list|match|enum|switch|case|break|continue|do|yield|fn)\b/
const HACK_KEYWORDS = /\b(function|class|if|else|for|foreach|while|return|echo|public|private|protected|static|new|try|catch|throw|namespace|use|require|include|extends|implements|interface|abstract|final|const|shape|vec|dict|keyset|async|await|concurrent|enum|type|newtype|tuple|inout)\b/

function buildLanguagePatterns(lang: string): LanguagePatterns | null {
  switch (lang) {
    case 'typescript':
    case 'javascript':
    case 'tsx':
    case 'jsx':
    case 'ts':
    case 'js':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /\/\*[\s\S]*?\*\// },
          { type: 'comment', regex: /\/\/[^\n]*/ },
          { type: 'string', regex: /`(?:[^`\\]|\\.)*`/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'constant', regex: /@\w+/ },
          { type: 'number', regex: /\b0x[0-9a-f_]+\b/i },
          { type: 'number', regex: /\b0b[01_]+\b/i },
          { type: 'number', regex: /\b0o[0-7_]+\b/i },
          { type: 'number', regex: /\b\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d+)?\b/i },
          { type: 'keyword', regex: JS_KEYWORDS },
          { type: 'function', regex: /\b[a-z_$][\w$]*(?=\s*\()/i },
          { type: 'type', regex: /\b[A-Z]\w*\b/ },
          { type: 'operator', regex: /[+\-*/%=!<>&|^~?:]+/ },
          { type: 'punctuation', regex: /[{}()[\];,.]/ },
          { type: 'variable', regex: /\b[a-z_$][\w$]*\b/i },
        ],
      }

    case 'json':
      return {
        defaultType: 'punctuation',
        patterns: [
          { type: 'property', regex: /"(?:[^"\\]|\\.)*"(?=\s*:)/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'number', regex: /-?\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i },
          { type: 'constant', regex: /\b(true|false|null)\b/ },
          { type: 'punctuation', regex: /[{}()[\]:,]/ },
        ],
      }

    case 'html':
    case 'xml':
    case 'svg':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /<!--[\s\S]*?-->/ },
          { type: 'keyword', regex: /<!DOCTYPE[^>]*>/i },
          { type: 'tag', regex: /<\/[a-z][\w-]*\s*>/i },
          { type: 'tag', regex: /<[a-z][\w-]*/i },
          { type: 'tag', regex: /\/?>/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'attribute', regex: /\b[a-z_:][\w:.-]*(?=\s*=)/i },
          { type: 'operator', regex: /=/ },
        ],
      }

    case 'css':
    case 'scss':
    case 'less':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /\/\*[\s\S]*?\*\// },
          { type: 'comment', regex: /\/\/[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'variable', regex: /--[a-z_-][\w-]*/i },
          { type: 'number', regex: /-?\b\d+(?:\.\d*)?(?:px|em|rem|%|vh|vw|vmin|vmax|ch|ex|deg|rad|turn|s|ms|fr)?\b/ },
          { type: 'constant', regex: /#[0-9a-f]{3,8}\b/i },
          { type: 'keyword', regex: CSS_KEYWORDS },
          { type: 'keyword', regex: /@[a-z][\w-]*/i },
          { type: 'tag', regex: /[.#][a-z_-][\w-]*/i },
          { type: 'keyword', regex: /::?[a-z][\w-]*/i },
          { type: 'function', regex: /\b[a-z_-][\w-]*(?=\s*\()/i },
          { type: 'property', regex: /[a-z_-][\w-]*(?=\s*:)/i },
          { type: 'punctuation', regex: /[{}()[\];:,]/ },
          { type: 'operator', regex: /[+~>*=|^$]/ },
        ],
      }

    case 'python':
    case 'py':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'string', regex: /"""[\s\S]*?"""/ },
          { type: 'string', regex: /'''[\s\S]*?'''/ },
          { type: 'string', regex: /f"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /f'(?:[^'\\]|\\.)*'/ },
          { type: 'comment', regex: /#[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'constant', regex: /@[\w.]+/ },
          { type: 'number', regex: /\b0x[0-9a-f_]+\b/i },
          { type: 'number', regex: /\b0b[01_]+\b/i },
          { type: 'number', regex: /\b0o[0-7_]+\b/i },
          { type: 'number', regex: /\b\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?j?\b/ },
          { type: 'keyword', regex: PYTHON_KEYWORDS },
          { type: 'function', regex: /\b[a-z_]\w*(?=\s*\()/i },
          { type: 'type', regex: /\b[A-Z]\w*\b/ },
          { type: 'operator', regex: /[+\-*/%=!<>&|^~@:]+/ },
          { type: 'punctuation', regex: /[{}()[\];,.]/ },
          { type: 'variable', regex: /\b[a-z_]\w*\b/i },
        ],
      }

    case 'bash':
    case 'sh':
    case 'zsh':
    case 'shell':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /#[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'[^']*'/ },
          { type: 'variable', regex: /\$\{[^}]+\}/ },
          { type: 'variable', regex: /\$[a-z_]\w*/i },
          { type: 'variable', regex: /\$[0-9@#?*!$-]/ },
          { type: 'number', regex: /\b\d+\b/ },
          { type: 'keyword', regex: BASH_KEYWORDS },
          { type: 'function', regex: /\b[a-z_]\w*(?=\s*\()/i },
          { type: 'operator', regex: /[|&<>;!]+/ },
          { type: 'punctuation', regex: /[{}()[\]]/ },
        ],
      }

    case 'php':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /\/\*[\s\S]*?\*\// },
          { type: 'comment', regex: /\/\/[^\n]*/ },
          { type: 'comment', regex: /#[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'variable', regex: /\$[a-z_]\w*/i },
          { type: 'number', regex: /\b0x[0-9a-f]+\b/i },
          { type: 'number', regex: /\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i },
          { type: 'keyword', regex: PHP_KEYWORDS },
          { type: 'function', regex: /\b[a-z_]\w*(?=\s*\()/i },
          { type: 'type', regex: /\b[A-Z]\w*\b/ },
          { type: 'operator', regex: /[+\-*/%=!<>&|^~?:.]+/ },
          { type: 'constant', regex: /@\w+/ },
          { type: 'punctuation', regex: /[{}()[\];,.]/ },
        ],
      }

    case 'hack':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /\/\*[\s\S]*?\*\// },
          { type: 'comment', regex: /\/\/[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'variable', regex: /\$[a-z_]\w*/i },
          { type: 'number', regex: /\b0x[0-9a-f]+\b/i },
          { type: 'number', regex: /\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i },
          { type: 'keyword', regex: HACK_KEYWORDS },
          { type: 'type', regex: /\b[A-Z]\w*\b/ },
          { type: 'function', regex: /\b[a-z_]\w*(?=\s*\()/i },
          { type: 'property', regex: /(?<=->|::)[a-z_]\w*\b/i },
          { type: 'operator', regex: /[+\-*/%=!<>&|^~?:.]+/ },
          { type: 'constant', regex: /<<\w+/ },
          { type: 'punctuation', regex: /[{}()[\];,.]/ },
        ],
      }

    case 'yaml':
    case 'yml':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /#[^\n]*/ },
          { type: 'string', regex: /"(?:[^"\\]|\\.)*"/ },
          { type: 'string', regex: /'(?:[^'\\]|\\.)*'/ },
          { type: 'constant', regex: /\b(true|false|yes|no|on|off|null|~)\b/i },
          { type: 'variable', regex: /[&*]\w+/ },
          { type: 'type', regex: /!!\w+/ },
          { type: 'number', regex: /\b-?\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i },
          { type: 'property', regex: /^[ \t]*\w[\w./-]*(?:\s+[\w./-]+)*(?=\s*:)/m },
          { type: 'keyword', regex: /---/ },
          { type: 'keyword', regex: /\.\.\./ },
          { type: 'operator', regex: /[:|>\-?]/ },
          { type: 'punctuation', regex: /[{}()[\],]/ },
          { type: 'variable', regex: /\b[a-z_]\w*\b/i },
        ],
      }

    case 'markdown':
    case 'md':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'keyword', regex: /^```\w*$/m },
          { type: 'keyword', regex: /^#{1,6}\s+.*/m },
          { type: 'keyword', regex: /^---$/m },
          { type: 'keyword', regex: /^\*\*\*$/m },
          { type: 'string', regex: /\*\*(?:[^*]|\*(?!\*))+\*\*/ },
          { type: 'string', regex: /\*[^*]+\*/ },
          { type: 'constant', regex: /`[^`]+`/ },
          { type: 'function', regex: /\[[^\]]+\]\([^)]+\)/ },
          { type: 'comment', regex: /^>\s+.*/m },
          { type: 'operator', regex: /^\s*[-*+]\s/m },
          { type: 'number', regex: /^\s*\d+\.\s/m },
        ],
      }

    default:
      return null
  }
}

function buildLanguage(lang: string): LanguageDefinition | null {
  const cached = langCache.get(lang)

  if (cached !== undefined)
    return cached

  const raw = buildLanguagePatterns(lang)
  const definition = raw == null
    ? null
    : {
        defaultType: raw.defaultType,
        patterns: raw.patterns.map(pattern => ({
          ...pattern,
          anchored: new RegExp(pattern.regex.source, `${pattern.regex.flags.replace(/[gy]/g, '')}y`),
        })),
      }

  langCache.set(lang, definition)

  return definition
}

/** Code shorter than this is tokenized synchronously instead of in chunks. */
export const SYNC_TOKENIZE_THRESHOLD = 2000

const ASYNC_CHUNK_SIZE = 800

async function yieldToMain(): Promise<void> {
  if (typeof scheduler !== 'undefined' && typeof scheduler.yield === 'function')
    return scheduler.yield()

  return new Promise(resolve => setTimeout(resolve, 0))
}

/** Tokens matching the language's own text color are omitted. */
function tokenizeLine(code: string, definition: LanguageDefinition, lineStart: number, lineEnd: number): SyntaxToken[] {
  const tokens: SyntaxToken[] = []
  const limit = Math.min(lineEnd, code.length)
  let position = lineStart

  while (position < limit) {
    let matched = false

    for (const pattern of definition.patterns) {
      pattern.anchored.lastIndex = position
      const match = pattern.anchored.exec(code)

      if (match != null && match.index === position && match[0].length > 0) {
        if (pattern.type !== definition.defaultType) {
          tokens.push({
            type: pattern.type,
            start: position - lineStart,
            end: position - lineStart + match[0].length,
          })
        }
        position += match[0].length
        matched = true
        break
      }
    }

    if (!matched)
      position++
  }

  return tokens
}

/**
 * Tokenize a code string into one token array per line, with offsets relative
 * to the start of the line.
 */
export function tokenize(code: string, language: string): TokenLine[] {
  const definition = buildLanguage(language)

  if (definition == null)
    return []

  const result: TokenLine[] = []
  let lineStart = 0

  for (let i = 0; i <= code.length; i++) {
    if (i === code.length || code[i] === '\n') {
      result.push(tokenizeLine(code, definition, lineStart, i))
      lineStart = i + 1
    }
  }

  return result
}

/**
 * The same result as {@link tokenize}, but yielding to the main thread between
 * chunks so a long file does not block rendering. An aborted signal stops the
 * work and returns the lines tokenized so far.
 */
export async function tokenizeAsync(code: string, language: string, signal?: AbortSignal): Promise<TokenLine[]> {
  const definition = buildLanguage(language)

  if (definition == null)
    return []

  const result: TokenLine[] = []
  let charsInChunk = 0
  let lineStart = 0

  for (let i = 0; i <= code.length; i++) {
    if (i === code.length || code[i] === '\n') {
      result.push(tokenizeLine(code, definition, lineStart, i))
      charsInChunk += i - lineStart + 1
      lineStart = i + 1

      if (charsInChunk >= ASYNC_CHUNK_SIZE && i < code.length) {
        if (signal?.aborted === true)
          return result

        charsInChunk = 0
        await yieldToMain()
      }
    }
  }

  return result
}

/**
 * Convert flat tokens with absolute offsets, as a custom tokenizer returns
 * them, into one line-relative token array per line.
 */
export function flatTokensToLines(tokens: SyntaxToken[], code: string): TokenLine[] {
  const lineStarts: number[] = [0]

  for (let i = 0; i < code.length; i++) {
    if (code[i] === '\n')
      lineStarts.push(i + 1)
  }

  const result: TokenLine[] = Array.from({ length: lineStarts.length }, () => [] as SyntaxToken[])
  let lineIndex = 0

  for (const token of tokens) {
    while (lineIndex < lineStarts.length - 1 && token.start >= lineStarts[lineIndex + 1])
      lineIndex++

    const lineStart = lineStarts[lineIndex]

    result[lineIndex].push({
      type: token.type,
      start: token.start - lineStart,
      end: token.end - lineStart,
    })
  }

  return result
}

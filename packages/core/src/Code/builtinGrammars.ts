import type { Grammar } from './grammar.js'
import {
  BLOCK_COMMENT,
  C_WORDS,
  CALL,
  cLike,
  CPP_WORDS,
  DIRECTIVE,
  NUMBER,
  PUNCTUATION,
} from './grammar.js'

/** Built-in grammars for C, C++, SQL, Rust, Kotlin, Swift and Go; null for any other identifier. */
export function buildSystemLanguagePatterns(lang: string): Grammar | null {
  switch (lang) {
    case 'c':
    case 'h':
      return cLike(C_WORDS, [{ type: 'keyword', regex: DIRECTIVE }])

    case 'cpp':
    case 'c++':
    case 'cc':
    case 'cxx':
    case 'hpp':
    case 'hh':
      return cLike(CPP_WORDS, [
        { type: 'keyword', regex: DIRECTIVE },
        { type: 'string', regex: /\b(?:u8|[uUL])?R"([^()\\\s]{0,16})\([\s\S]*?\)\1"/ },
      ])

    case 'sql':
      return {
        defaultType: 'variable',
        patterns: [
          { type: 'comment', regex: /--[^\n]*/ },
          { type: 'comment', regex: BLOCK_COMMENT },
          { type: 'string', regex: /'(?:[^']|'')*'/ },
          { type: 'property', regex: /"[^"\n]*"|`[^`\n]*`/ },
          { type: 'number', regex: NUMBER },
          {
            type: 'keyword',
            regex: /\b(?:select|from|where|and|or|not|in|is|null|as|join|inner|left|right|full|outer|cross|on|group|by|order|having|limit|offset|union|all|distinct|insert|into|values|update|set|delete|create|table|view|index|drop|alter|add|primary|key|foreign|references|with|case|when|then|else|end|exists|between|like|asc|desc|true|false|default|returning|interval)\b/i,
          },
          { type: 'function', regex: CALL },
          { type: 'operator', regex: /[+\-*/%=<>!|]+/ },
          { type: 'punctuation', regex: PUNCTUATION },
        ],
      }

    case 'rust':
    case 'rs':
      return cLike(
        'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while',
        [
          { type: 'constant', regex: /#!?\[[^\]\n]*\]/ },
          { type: 'function', regex: /\b[a-z_]\w*!(?=\s*[([{])/i },
          { type: 'string', regex: /\bb?r(#*)"[\s\S]*?"\1/ },
          { type: 'type', regex: /'[a-z_]\w*\b(?!')/ },
        ],
      )

    case 'kotlin':
    case 'kt':
    case 'kts':
      return cLike(
        'as break class continue do else false for fun if in interface is null object package return super this throw true try typealias val var when while by constructor init companion data sealed enum open override private protected public internal suspend inline lateinit import',
        [
          { type: 'constant', regex: /@\w+/ },
          { type: 'string', regex: /"""[\s\S]*?"""/ },
        ],
      )

    case 'swift':
      return cLike(
        'associatedtype class deinit enum extension func import init inout internal let open operator private protocol public static struct subscript typealias var break case continue default defer do else fallthrough for guard if in repeat return switch where while as catch false is nil rethrows super self Self throw throws true try async await actor some any',
        [
          { type: 'string', regex: /(#+)"[\s\S]*?"\1/ },
          { type: 'constant', regex: /[@#]\w+/ },
          { type: 'string', regex: /"""[\s\S]*?"""/ },
        ],
      )

    case 'go':
    case 'golang':
      return cLike(
        'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var true false nil iota',
        [{ type: 'string', regex: /`[^`]*`/ }],
      )

    default:
      return null
  }
}

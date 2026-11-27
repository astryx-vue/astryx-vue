import { defineCodeLanguage, DOUBLE_QUOTED, HASH_COMMENT } from '../../grammar.js'

/** TOML: `toml`. */
export const toml = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'toml',
    identifiers: ['toml'],
    fileExtensions: ['toml'],
    fileNames: [],
  },
  () => ({
    defaultType: 'variable',
    patterns: [
      { type: 'comment', regex: HASH_COMMENT },
      { type: 'tag', regex: /^[ \t]*\[[^\]\n]+\]\]?/m },
      { type: 'property', regex: /^[ \t]*[\w."'-]+(?=\s*=)/m },
      { type: 'string', regex: /"""[\s\S]*?"""|'''[\s\S]*?'''/ },
      { type: 'string', regex: DOUBLE_QUOTED },
      { type: 'string', regex: /'[^'\n]*'/ },
      { type: 'constant', regex: /\b(?:true|false)\b/ },
      { type: 'number', regex: /[+-]?\b\d[\d_:.TZ+-]*\b/ },
      { type: 'operator', regex: /=/ },

      { type: 'punctuation', regex: /[[\]{},.]/ },
    ],
  }),
)

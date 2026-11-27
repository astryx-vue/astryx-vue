import { cLike, defineCodeLanguage, HASH_COMMENT } from '../../grammar.js'

/** PowerShell: `powershell`, `ps1`, `pwsh`. */
export const powershell = /* @__PURE__ */ defineCodeLanguage(
  {
    name: 'powershell',
    identifiers: ['powershell', 'ps1', 'pwsh'],
    fileExtensions: ['ps1', 'psm1', 'psd1'],
    fileNames: [],
  },
  () =>
    cLike(
      'begin break catch class continue data do dynamicparam else elseif end exit filter finally for foreach function if in param process return switch throw trap try until using while',
      [
        { type: 'comment', regex: /<#[\s\S]*?#>/ },
        { type: 'variable', regex: /\$[\w:]+/ },
        { type: 'function', regex: /\b[A-Z][a-z]+-[A-Z]\w*/ },
        { type: 'operator', regex: /-[a-z]+\b/ },
      ],
      [HASH_COMMENT],
    ),
)

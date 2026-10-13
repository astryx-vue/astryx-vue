export { default as Code } from './Code.vue'
export { default as CodeBlock } from './CodeBlock.vue'
export { applyHighlightRanges, HIGHLIGHTED_TOKEN_TYPES } from './highlightRanges.js'
export {
  allSyntaxPresets,
  catppuccinLatte,
  catppuccinMocha,
  darkSyntaxPresets,
  dracula,
  githubLight,
  lightSyntaxPresets,
  monokai,
  nord,
  oneDarkPro,
  oneLight,
  solarizedLight,
  tokyoNight,
  tokyoNightLight,
} from './syntaxPresets.js'
export { defineSyntaxTheme, githubDark, SYNTAX_TOKEN_KEYS } from './syntaxTheme.js'
export type { SyntaxThemeDefinition, SyntaxThemeInput, SyntaxThemeTokens, SyntaxTokenKey, SyntaxTokenValue } from './syntaxTheme.js'
export { default as SyntaxTheme } from './SyntaxTheme.vue'
export { flatTokensToLines, SYNC_TOKENIZE_THRESHOLD, tokenize, tokenizeAsync } from './tokenizer.js'
export type {
  CodeBlockContainer,
  CodeBlockEmits,
  CodeBlockProps,
  CodeBlockSize,
  CodeBlockTokenizer,
  CodeColor,
  CodeHighlightMode,
  CodeProps,
  CodeSize,
  CodeSlots,
  SyntaxToken,
  TokenLine,
} from './types.js'
export type { CopyToClipboardOptions, CopyToClipboardReturn } from './useCopyToClipboard.js'
export { useCopyToClipboard } from './useCopyToClipboard.js'
export type { UseSyntaxThemeReturn } from './useSyntaxTheme.js'
export { useSyntaxTheme } from './useSyntaxTheme.js'

export { default as Code } from './Code.vue'
export { default as CodeBlock } from './CodeBlock.vue'
export { applyHighlightRanges, HIGHLIGHTED_TOKEN_TYPES } from './highlightRanges.js'
export { defineSyntaxTheme, githubDark } from './syntaxTheme.js'
export type { SyntaxThemeDefinition, SyntaxThemeTokens } from './syntaxTheme.js'
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

export { isMarkdownExtensionNode } from './ast.js'
export { visitMarkdownNodes } from './canonicalAst.js'
export type {
  MarkdownAstPhrasingContent,
  MarkdownAstRoot,
} from './canonicalAst.js'
export { default as Markdown } from './Markdown.vue'
export { parseMarkdown } from './parse.js'
export type { ParseMarkdownOptions } from './parse.js'
export type {
  BlockNode,
  InlineNode,
  ParseOptions,
  SourceRange,
} from './parser/index.js'
export { applyInlinePlugins, applyMarkdownPlugins, defineMarkdownPlugin } from './plugins.js'
export type {
  MarkdownInlinePlugin,
  MarkdownPlugin,
  MarkdownPluginRenderContext,
  MarkdownTransformContext,
} from './plugins.js'
export {
  createIncrementalState,
  decodeMarkdownCharacterReferences,
  parseInline,
  parseInlineAst,
  parseMarkdownAst,
  parseMarkdownIncremental,
} from './publicParser.js'
export { slugify, uniqueSlug } from './slug.js'
export type {
  MarkdownAlign,
  MarkdownAutolink,
  MarkdownCitationStyle,
  MarkdownCodeProps,
  MarkdownComponents,
  MarkdownDensity,
  MarkdownDisplay,
  MarkdownHeadingLevel,
  MarkdownHeadingProps,
  MarkdownImageProps,
  MarkdownInlineCodeProps,
  MarkdownLinkProps,
  MarkdownListProps,
  MarkdownProps,
  MarkdownSlots,
  MarkdownSource,
} from './types.js'

// 构建之后确认三个 Markdown 子路径能从包名 import，并且符号在 dist 里。
// vitest 会走 package.json 的 source 条件，读的是 src，发现不了 dist 缺失。
import { parseMarkdownAst } from '@astryx-vue/core/Markdown/parser'
import { MarkdownPluginNodeRenderer } from '@astryx-vue/core/Markdown/plugin-renderer'
import { createMarkdownPlugin } from '@astryx-vue/core/Markdown/plugins'

if (typeof parseMarkdownAst !== 'function')
  throw new Error('@astryx-vue/core/Markdown/parser 没有导出 parseMarkdownAst')
if (typeof createMarkdownPlugin !== 'function')
  throw new Error('@astryx-vue/core/Markdown/plugins 没有导出 createMarkdownPlugin')
if (MarkdownPluginNodeRenderer == null || typeof MarkdownPluginNodeRenderer !== 'object')
  throw new Error('@astryx-vue/core/Markdown/plugin-renderer 没有导出 MarkdownPluginNodeRenderer')

const ast = parseMarkdownAst('# Hi')
if (ast?.type !== 'root')
  throw new Error('parseMarkdownAst 没有返回 root')

console.log('markdown subpath smoke ok')

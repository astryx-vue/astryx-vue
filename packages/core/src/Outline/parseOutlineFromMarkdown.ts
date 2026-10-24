import type { MdNode } from '../Markdown/ast.js'
import type { ParseOptions } from '../Markdown/publicParser.js'
import type { OutlineItem } from './types.js'
import { plainText } from '../Markdown/ast.js'
import { parseMarkdownAst } from '../Markdown/publicParser.js'
import { slugify, uniqueSlug } from '../Markdown/slug.js'

export interface ParseOutlineFromMarkdownOptions {
  readonly plugins?: ParseOptions['plugins']
  /** 流还没写完时传 false，和 Markdown 解析的收尾规则一致。 */
  readonly isFinal?: boolean
}

/**
 * 从 Markdown 抽出目录。
 * id 和 Markdown 渲染到标题上的 id 用同一套 slug：全文里的标题都占号，
 * 只有写在根上的标题进目录。围栏代码里的井号不是标题。
 */
export function parseOutlineFromMarkdown(
  markdown: string,
  options?: ParseOutlineFromMarkdownOptions,
): OutlineItem[] {
  const root = parseMarkdownAst(markdown, {
    plugins: options?.plugins,
    isFinal: options?.isFinal,
  }) as unknown as MdNode
  const counts = new Map<string, number>()
  const outline: OutlineItem[] = []
  collect(root.children, true, counts, outline)
  return outline
}

function collect(
  nodes: MdNode[] | undefined,
  atRoot: boolean,
  counts: Map<string, number>,
  outline: OutlineItem[],
): void {
  for (const node of nodes ?? []) {
    if (node.type === 'heading') {
      const label = plainText(node).trim()
      const id = uniqueSlug(slugify(label), counts)
      if (atRoot)
        outline.push({ id, label, level: node.depth ?? 1 })
    }
    if (node.children != null)
      collect(node.children, false, counts, outline)
  }
}

import type { BlockNode, InlineNode, MarkdownAstPhrasingContent, MarkdownAstRoot } from './parser/index.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  createMarkdownFrontmatter,
  createMarkdownPlugin,
  getMarkdownPluginCapabilities,
} from './plugin-protocol/index.js'
import {
  createIncrementalState,
  decodeMarkdownCharacterReferences,
  parseInline,
  parseInlineAst,
  parseMarkdown,
  parseMarkdownAst,
  parseMarkdownIncremental,
} from './publicParser.js'

async function loadSubpath(specifier: string): Promise<Record<string, unknown>> {
  return import(specifier)
}

function findNode(
  node: object,
  matches: (node: Record<string, unknown>) => boolean,
): Record<string, unknown> | undefined {
  const record = node as Record<string, unknown>
  if (matches(record))
    return record
  if (!Array.isArray(record.children))
    return undefined
  for (const child of record.children) {
    if (child == null || typeof child !== 'object')
      continue
    const found = findNode(child, matches)
    if (found != null)
      return found
  }
  return undefined
}

describe('@astryx-vue/core/Markdown/parser', () => {
  it('decodes character references and leaves an unknown name', () => {
    expectTypeOf(decodeMarkdownCharacterReferences).toEqualTypeOf<(text: string) => string>()
    expect(decodeMarkdownCharacterReferences('&copy; &unknown;')).toBe('© &unknown;')
  })

  it('publishes parser, plugins, and plugin-renderer subpaths', async () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'packages/core/package.json'), 'utf8')) as {
      exports: Record<string, { source?: string, types?: string, import?: string }>
    }
    expect(packageJson.exports['./Markdown/parser']).toEqual({
      source: './src/Markdown/parser/index.ts',
      types: './dist/Markdown/parser/index.d.ts',
      import: './dist/Markdown/parser/index.js',
    })
    expect(packageJson.exports['./Markdown/plugins']).toMatchObject({
      source: './src/Markdown/plugin-protocol/index.ts',
      types: './dist/Markdown/plugin-protocol/index.d.ts',
      import: './dist/Markdown/plugin-protocol/index.js',
    })
    expect(packageJson.exports['./Markdown/plugin-renderer']).toMatchObject({
      source: './src/Markdown/plugin-renderer/index.ts',
      types: './dist/Markdown/plugin-renderer/index.d.ts',
      import: './dist/Markdown/plugin-renderer/index.js',
    })
    const publishExports = (packageJson as {
      publishConfig?: { exports?: Record<string, { types?: string, import?: string }> }
    }).publishConfig?.exports
    for (const key of ['./Markdown/parser', './Markdown/plugins', './Markdown/plugin-renderer']) {
      expect(publishExports?.[key]).toEqual({
        types: packageJson.exports[key].types,
        import: packageJson.exports[key].import,
      })
    }
    const tsdown = readFileSync(join(process.cwd(), 'packages/core/tsdown.config.ts'), 'utf8')
    expect(tsdown).toContain('src/Markdown/parser/index.ts')
    expect(tsdown).toContain('src/Markdown/plugin-protocol/index.ts')
    expect(tsdown).toContain('src/Markdown/plugin-renderer/index.ts')
    expect(typeof (await loadSubpath('@astryx-vue/core/Markdown/parser')).parseMarkdownAst).toBe('function')
    expect(typeof (await loadSubpath('@astryx-vue/core/Markdown/plugins')).createMarkdownPlugin).toBe('function')
    expect(typeof (await loadSubpath('@astryx-vue/core/Markdown/plugin-renderer')).MarkdownPluginNodeRenderer).toBe('object')
    for (const path of [
      'packages/core/src/Markdown/parser/index.ts',
      'packages/core/src/Markdown/publicParser.ts',
      'packages/core/src/Markdown/plugin-protocol/index.ts',
      'packages/core/src/Markdown/plugin-protocol/protocol.ts',
      'packages/core/src/Markdown/plugin-protocol/frontmatter.ts',
      'packages/core/src/Markdown/plugin-renderer/index.ts',
    ]) {
      expect(readFileSync(join(process.cwd(), path), 'utf8')).not.toMatch(/^\s*['"]use client['"]/m)
    }
  })

  it('reports transform capability and rejects a plain object', () => {
    const transformOnly = createMarkdownPlugin({
      name: 'server-capabilities',
      apiVersion: 1,
      transform: root => root,
    })
    expect(getMarkdownPluginCapabilities(transformOnly)).toEqual({
      syntax: false,
      transform: true,
    })
    expect(() => getMarkdownPluginCapabilities({ name: 'nope', apiVersion: 1 } as never)).toThrow(/createMarkdownPlugin/)
  })

  it('exposes canonical and legacy parser results', () => {
    const source = '# Heading\n\nParagraph'
    const blockAst = parseMarkdownAst(source)
    const inlineAst = parseInlineAst('**bold**')

    expect(blockAst).toMatchObject({
      type: 'root',
      children: [{ type: 'heading', depth: 1 }, { type: 'paragraph' }],
    })
    expect(inlineAst).toMatchObject([{ type: 'strong' }])
    expect(parseMarkdown(source)[0]).toMatchObject({ type: 'heading', level: 1 })
    expect(parseInline('**bold**')[0]).toMatchObject({ type: 'bold' })
    expect(parseMarkdownIncremental(source, createIncrementalState())).toEqual(parseMarkdown(source))
    expect(parseMarkdown('# A', { sourceRanges: true })[0]?.range).toEqual({ start: 0, end: 3 })

    const canonicalBlockAst: MarkdownAstRoot = blockAst
    const canonicalInlineAst: ReadonlyArray<MarkdownAstPhrasingContent> = inlineAst
    expect(canonicalBlockAst).toBe(blockAst)
    expect(canonicalInlineAst).toBe(inlineAst)
    expectTypeOf(parseMarkdown(source)).toEqualTypeOf<BlockNode[]>()
    expectTypeOf(parseInline('text')).toEqualTypeOf<InlineNode[]>()
    expect(parseMarkdownAst('')).toMatchObject({ type: 'root', children: [] })
  })

  it('runs frontmatter before a later transform and drops the fence', () => {
    const frontmatter = createMarkdownFrontmatter({
      name: 'server-document-metadata',
      parse: fields => ({ title: fields.title ?? 'Untitled' }),
    })
    let title: string | undefined
    const observer = createMarkdownPlugin({
      name: 'server-metadata-observer',
      apiVersion: 1,
      transform(root) {
        title = frontmatter.getMetadata(root)?.title
        return root
      },
    })
    const root = parseMarkdownAst('---\ntitle: Server proof\n---\n# Body', {
      plugins: [frontmatter.plugin, observer],
    })

    expect(title).toBe('Server proof')
    expect(root.children).toMatchObject([{ type: 'heading', depth: 1 }])
  })

  it('splices an inline syntax plugin into the canonical tree', () => {
    const mention = createMarkdownPlugin({
      name: 'mention',
      apiVersion: 1,
      parseKey: 'mention',
      syntax: {
        inline: [{
          startsWith: ['@'],
          maxSpan: 32,
          tokenize(input) {
            const slice = input.source.slice(input.offset, input.end)
            const match = /^@[A-Z0-9]+/i.exec(slice)
            if (match == null)
              return { status: 'no-match' }
            return {
              status: 'match',
              end: input.offset + match[0].length,
              node: {
                type: 'extension',
                plugin: 'mention',
                name: 'user',
                display: 'inline',
                data: { id: match[0].slice(1) },
              },
            }
          },
        }],
      },
      renderers: {
        user: {
          render: ({ node }) => node.source ?? '',
          toText: node => node.source ?? '',
        },
      },
    })
    const root = parseMarkdownAst('Hi @ada', { plugins: [mention] })
    const found = findNode(root, node => node.type === 'extension')
    expect(found).toMatchObject({ type: 'extension', plugin: 'mention', name: 'user', source: '@ada' })
  })
})

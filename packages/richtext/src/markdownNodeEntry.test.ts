// @vitest-environment node

// `@astryx-vue/richtext/markdown` 要在没有浏览器的地方也能用：Node、Worker、服务端渲染。
// 这条测试在 node 环境里真的把这个入口 import 进来，跑一次往返，再顺着源码的 import
// 走一遍，确认没有碰到任何 Vue 组件（`.vue` 文件）或 `vue` 运行时。

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))

/** 从 `file` 出发能走到的全部源码文件，按 import 说明符逐个展开。 */
function moduleGraph(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file))
    return seen
  seen.add(file)
  const source = readFileSync(file, 'utf8')
  for (const [, specifier] of source.matchAll(/^(?:import|export)[^'"]*from\s+['"]([^'"]+)['"]/gm)) {
    if (!specifier.startsWith('.'))
      continue
    const base = resolve(dirname(file), specifier)
    const sourceBase = base.endsWith('.js') ? base.slice(0, -'.js'.length) : base
    const next = [`${sourceBase}.ts`, `${sourceBase}.tsx`, join(sourceBase, 'index.ts')].find((path) => {
      try {
        readFileSync(path)
        return true
      }
      catch {
        return false
      }
    })
    if (next != null)
      moduleGraph(next, seen)
  }
  return seen
}

// Node 直接 import 时走 core 的 dist（source 条件指向的 TS 它读不了），
// 所以只有 core 构建过才跑这一条。静态那一条任何时候都跑。
const coreIsBuilt = existsSync(join(here, '../../core/dist/Markdown/parser/index.js'))

describe('@astryx-vue/richtext/markdown runs without a browser', () => {
  it.skipIf(!coreIsBuilt)('imports and round-trips in Node', async () => {
    const { editorStateJSONToMarkdown, markdownToEditorStateJSON } = await import('./markdown.js')
    const markdown = '# Title\n\nSome *emphasis* and `code`.\n\n- one\n- two\n'
    expect(editorStateJSONToMarkdown(markdownToEditorStateJSON(markdown))).toBe(markdown)
  })

  it('reaches no Vue component and no Vue runtime', () => {
    const files = [...moduleGraph(join(here, 'markdown.ts'))]
    expect(files.length).toBeGreaterThan(10)
    for (const file of files) {
      expect(file.endsWith('.vue'), file).toBe(false)
      const source = readFileSync(file, 'utf8')
      for (const [, specifier] of source.matchAll(/^(?:import|export)[^'"]*from\s+['"]([^'"]+)['"]/gm))
        expect(specifier, file).not.toMatch(/^(vue|@vue\/|@astryx-vue\/core\/(?!Markdown\/))(.*)$/)
    }
  })
})

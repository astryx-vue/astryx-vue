import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * 按子路径引入组件时不会加载总的 `styles.css`，浮层的文字重置（`styles/layer.css`）
 * 只能靠组件自己的 import 链带进来。这里保证：模板里用了 `layer.css` 所列类名的
 * 每个组件，都能沿 import 链走到 `layer.css`。
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LAYER_CSS = resolve(SRC, '../styles/layer.css')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory())
      return sourceFiles(full)
    const isSource = /\.(?:vue|ts)$/.test(entry.name) && !/\.(?:test|spec)\.ts$/.test(entry.name) && !entry.name.endsWith('.d.ts')
    return isSource ? [full] : []
  })
}

/** `layer.css` 里 `:where(...)` 列出的类名。 */
function layerClassNames(): string[] {
  const css = readFileSync(LAYER_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const group = /:where\(([^)]*)\)/.exec(css)?.[1] ?? ''
  return [...group.matchAll(/\.([\w-]+)/g)].map(match => match[1]!)
}

const files = sourceFiles(SRC)
const sources = new Map(files.map(file => [file, readFileSync(file, 'utf8')]))

/** 一个文件的相对 import，解析成 src 里真实存在的文件。 */
function localImports(file: string): string[] {
  const code = sources.get(file) ?? ''
  const found: string[] = []
  for (const match of code.matchAll(/(?:from|import)\s+['"](\.[^'"]+)['"]/g)) {
    const target = resolve(dirname(file), match[1]!)
    const candidates = [target, target.replace(/\.js$/, '.ts'), target.replace(/\.js$/, '.vue'), join(target, 'index.ts')]
    const hit = candidates.find(candidate => sources.has(candidate))
    if (hit)
      found.push(hit)
  }
  return found
}

function importsLayerCss(file: string): boolean {
  return /import\s+['"][^'"]*styles\/layer\.css['"]/.test(sources.get(file) ?? '')
}

function reachesLayerCss(start: string): boolean {
  const seen = new Set<string>()
  const queue = [start]
  while (queue.length > 0) {
    const file = queue.pop()!
    if (seen.has(file))
      continue
    seen.add(file)
    if (importsLayerCss(file))
      return true
    queue.push(...localImports(file))
  }
  return false
}

/** 类名作为完整的 class 词出现在这个文件里（不是 `astryx-popover-foo` 这种更长的名字）。 */
function usesClass(code: string, name: string): boolean {
  return new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(code)
}

describe('layer.css 的加载链', () => {
  const names = layerClassNames()

  it('能从 layer.css 读出浮层类名', () => {
    expect(names).toContain('astryx-layer')
    expect(names).toContain('astryx-popover')
  })

  it.each(names)('用到 .%s 的组件都能走到 layer.css', (name) => {
    const users = files.filter((file) => {
      if (!file.endsWith('.vue'))
        return false
      const code = sources.get(file) ?? ''
      return usesClass(code, name) && new RegExp(`class=["'][^"']*(?<![\\w-])${name}(?![\\w-])`).test(code)
    })
    const missing = users.filter(file => !reachesLayerCss(file))
    expect(missing.map(file => file.slice(SRC.length + 1))).toEqual([])
  })

  it('toast 视口（用字符串列表声明 astryx-layer）也能走到 layer.css', () => {
    expect(reachesLayerCss(join(SRC, 'Toast/ToastViewport.vue'))).toBe(true)
  })
})

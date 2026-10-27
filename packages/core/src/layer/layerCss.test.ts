import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * 浮层的文字重置写在 `styles/layer.css` 里。按子路径引入组件时不会加载总的 `styles.css`，
 * 所以每个把内容 Teleport 出去的组件，都要满足两条：
 *
 * 1. 自己直接引入 `layer.css`：直接 import 它，或者 import 会引入它的 `layer/scopedProvide`
 *    或 `layer/LayerContentBoundary`。只靠别的组件间接带进来不算数，那条链随时可能断。
 * 2. Teleport 出去的根元素带有 `layer.css` 重置规则能命中的类名，比如 `astryx-layer`。
 *
 * 不是新浮层根的 Teleport（挂进组件自己的某个位置，或者挂进已经重置过的浮层里面）
 * 列在 `NOT_A_LAYER_ROOT` 里，并写明原因。
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LAYER_CSS = resolve(SRC, '../styles/layer.css')

const NOT_A_LAYER_ROOT: Record<string, string> = {
  'Chat/ChatComposerInput.vue': '挂进输入框里自己的 span，不离开组件',
  'TopNav/TopNav.vue': '挂进 MobileNav 的抽屉，MobileNav 的根已经重置',
  'DropdownMenu/DropdownMenuSubMenu.vue': '下钻面板挂进父菜单内部，父菜单的根已经重置',
  'ContextMenu/ContextMenuSubMenu.vue': '下钻面板挂进父菜单内部，父菜单的根已经重置',
}

const LOADS_LAYER_CSS = /(?:import|from)\s*['"][^'"]*(?:styles\/layer\.css|layer\/scopedProvide(?:\.js)?|layer\/LayerContentBoundary\.vue)['"]/

function vueFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory())
      return vueFiles(full)
    return entry.name.endsWith('.vue') ? [full] : []
  })
}

/** `layer.css` 重置规则里 `:where(...)` 列出的类名。 */
function layerClassNames(): string[] {
  const css = readFileSync(LAYER_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const group = /:where\(([^)]*)\)/.exec(css)?.[1] ?? ''
  return [...group.matchAll(/\.([\w-]+)/g)].map(match => match[1]!)
}

/** 每个 `<Teleport>` 里第一个元素的开始标签（含 class 和 :class）。 */
function teleportRoots(code: string): string[] {
  return [...code.matchAll(/<Teleport\b[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*(?:<Transition\b[^>]*>\s*(?:<!--[\s\S]*?-->\s*)*)?(<[a-z][^>]*>)/g)]
    .map(match => match[1]!)
}

const teleporters = vueFiles(SRC)
  .map(file => ({ name: relative(SRC, file), code: readFileSync(file, 'utf8') }))
  .filter(({ code }) => code.includes('<Teleport'))
  .filter(({ name }) => !(name in NOT_A_LAYER_ROOT))

describe('浮层的文字重置', () => {
  const classes = layerClassNames()

  it('能从 layer.css 读出类名', () => {
    expect(classes).toContain('astryx-layer')
  })

  it('找到了全部浮层组件', () => {
    expect(teleporters.length).toBeGreaterThan(15)
  })

  it('scopedProvide 直接引入 layer.css', () => {
    const code = readFileSync(join(SRC, 'layer/scopedProvide.ts'), 'utf8')
    expect(code).toMatch(/import\s+['"]\.\.\/\.\.\/styles\/layer\.css['"]/)
  })

  it.each(teleporters.map(t => [t.name, t] as const))('%s 自己引入 layer.css', (_name, { code }) => {
    expect(code).toMatch(LOADS_LAYER_CSS)
  })

  it.each(teleporters.map(t => [t.name, t] as const))('%s 的浮层根带有重置类名', (_name, { code }) => {
    const roots = teleportRoots(code)
    expect(roots.length).toBeGreaterThan(0)
    for (const root of roots) {
      const covered = classes.some(name => new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(root))
      const usesClassesBinding = /:class="classes"/.test(root) && /['"]astryx-layer['"]/.test(code)
      expect(covered || usesClassesBinding, root).toBe(true)
    }
  })
})

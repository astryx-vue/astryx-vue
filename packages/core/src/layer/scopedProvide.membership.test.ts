import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useFormLayout } from '../FormLayout/context.js'
import LayerContentBoundary from './LayerContentBoundary.vue'
import { registeredLayerScopedContexts } from './scopedProvide.js'

/**
 * 成员关系 context 必须在自己的模块里调用 `defineLayerScopedKey`。
 * `scopedProvide.ts` 不再引用组件，漏登记的话这个扫描会失败。
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 有 InjectionKey、但不是「我属于外面那个组」的 context。 */
const NON_MEMBERSHIP = new Set([
  'locale/context.ts',
  'InternationalizationProvider/context.ts',
  'LayerProvider/context.ts',
  'LinkProvider/context.ts',
  'ContextMenu/context.ts',
  'Dialog/context.ts',
  'CommandPalette/context.ts',
  'AlertDialog/context.ts',
  'Typeahead/context.ts',
  'Theme/context.ts',
  'SideNav/context.ts',
  'Scrollbars/context.ts',
  'MobileNav/context.ts',
  'MoreMenu/context.ts',
])

/** 和成员 key 写在同一个文件里、但不进浮层重置的 Symbol。 */
const RAW_OK = new Set([
  'chatLayoutContextKey',
  'chatComposerContextKey',
  'AvatarStatusLabelContext',
  'navMenuCloseKey',
  'navMenuFocusKey',
  'dropdownMenuRadioGroupKey',
  'itemDescriptionContextKey',
])

function collectContextFiles(dir: string, acc: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      collectContextFiles(full, acc)
      continue
    }
    const isContext = entry.name === 'context.ts'
    const isRadioTypes = entry.name === 'types.ts' && full.endsWith(`${sep}Radio${sep}types.ts`)
    if (isContext || isRadioTypes)
      acc.push(full)
  }
}

enableAutoUnmount(afterEach)

describe('成员关系 context 的登记', () => {
  it('每个成员 key 都走 defineLayerScopedKey，漏掉的文件必须在非成员名单里', async () => {
    const files: string[] = []
    collectContextFiles(SRC, files)
    let callSites = 0

    for (const file of files) {
      const rel = relative(SRC, file).split(sep).join('/')
      const code = readFileSync(file, 'utf8')
      const calls = code.split('\n').filter(line =>
        line.includes('defineLayerScopedKey') && !line.trimStart().startsWith('import '),
      ).length
      const hasInjectionKey = code.includes('InjectionKey')
      if (calls > 0) {
        callSites += calls
        const rawNames = [...code.matchAll(/export const (\w+)(?::[^=]+)?=\s*Symbol\(/g)].map(match => match[1])
        for (const name of rawNames)
          expect(RAW_OK.has(name), `${rel} 里的 ${name}`).toBe(true)
        await import(pathToFileURL(file).href)
        continue
      }
      if (hasInjectionKey)
        expect(NON_MEMBERSHIP.has(rel), rel).toBe(true)
    }

    for (const rel of NON_MEMBERSHIP) {
      const code = readFileSync(join(SRC, rel), 'utf8')
      expect(code.includes('InjectionKey'), rel).toBe(true)
      expect(code.includes('defineLayerScopedKey'), rel).toBe(false)
    }

    expect(registeredLayerScopedContexts().length).toBe(callSites)
    expect(callSites).toBeGreaterThanOrEqual(23)
  })

  it('scopedProvide 不引用组件，并且仍然引入 layer.css', () => {
    const code = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './scopedProvide.ts'), 'utf8')
    expect(code).toMatch(/styles\/layer\.css/)
    expect(code).not.toMatch(/from ['"]\.\.\/[A-Z]/)
    expect(code).not.toMatch(/from ['"][^'"]*\/context(?:\.js)?['"]/)
  })

  it('浮层边界内外读到的 FormLayout 默认值是同一个 computed', () => {
    let outside: unknown
    let inside: unknown
    const Inside = defineComponent({
      name: 'InsideProbe',
      setup() {
        inside = useFormLayout()
        return () => null
      },
    })
    mount(defineComponent({
      name: 'OutsideProbe',
      setup() {
        outside = useFormLayout()
        return () => h(LayerContentBoundary, () => h(Inside))
      },
    }))
    expect(inside).toBe(outside)
    expect(outside).toBeTypeOf('object')
  })
})

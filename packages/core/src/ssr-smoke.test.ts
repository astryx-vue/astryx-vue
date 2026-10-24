// @vitest-environment node
import type { SSRContext } from '@vue/server-renderer'
import type { Component, VNode } from 'vue'
import type { SsrFixture } from './ssr-smoke.fixtures.js'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import * as core from './index.js'
import knownFailures from './ssr-known-failures.json'
import { ssrFixtures } from './ssr-smoke.fixtures.js'

// 把总入口导出的每个 Vue 组件在 Node 里用 renderToString 渲染一遍。
// 通过的条件：不抛错、不碰浏览器全局对象、没有 Vue 警告或错误、输出不为空。
//
// 已知失败名单 ssr-known-failures.json 里的组件用 it.fails 跑：仍然失败才算通过。
// 组件修好以后这条用例会变红，提醒把它从名单里删掉，名单只会越来越短。
// 组件需要的必填 props、插槽和父组件写在 ssr-smoke.fixtures.ts。

const KNOWN_FAILURES: Record<string, string> = knownFailures

// Node 自带 navigator、sessionStorage、localStorage，浏览器才有的 window、document
// 在 Node 里本来就不存在。渲染期间把这几个也拿掉，组件在服务端读它们就会抛 ReferenceError。
const BROWSER_ONLY_NODE_GLOBALS = ['navigator', 'sessionStorage', 'localStorage'] as const

function isComponent(value: unknown): value is Component {
  return typeof value === 'object' && value !== null && ('render' in value || 'setup' in value)
}

const components = (Object.entries(core) as [string, unknown][])
  .filter((entry): entry is [string, Component] => isComponent(entry[1]))
  .sort(([a], [b]) => a.localeCompare(b, 'en'))

const componentNames = new Set(components.map(([name]) => name))

function hideBrowserGlobals(): () => void {
  const saved = BROWSER_ONLY_NODE_GLOBALS.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)] as const)
  for (const [name, descriptor] of saved) {
    if (descriptor)
      Reflect.deleteProperty(globalThis, name)
  }
  return () => {
    for (const [name, descriptor] of saved) {
      if (descriptor)
        Object.defineProperty(globalThis, name, descriptor)
    }
  }
}

/** 去掉 Vue 的片段和占位注释后，判断有没有真正的内容。 */
function isEmptyHtml(html: string): boolean {
  return html.replace(/<!--[\s\S]*?-->/g, '').trim() === ''
}

function describeError(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error)
}

async function renderSmoke(name: string, component: Component): Promise<void> {
  const fixture: SsrFixture = ssrFixtures[name] ?? {}
  const problems: string[] = []
  const child = (): VNode => h(component, fixture.props ?? {}, fixture.slots)
  const app = createSSRApp({ render: () => fixture.wrap ? fixture.wrap(child) : child() })
  app.config.warnHandler = (message) => {
    problems.push(`Vue 警告：${message}`)
  }
  app.config.errorHandler = (error) => {
    problems.push(`Vue 错误：${describeError(error)}`)
  }

  const restore = hideBrowserGlobals()
  const context: SSRContext = {}
  let html = ''
  try {
    // Teleport 的内容不在主输出里，单独放在 context.teleports，一起算作输出。
    html = await renderToString(app, context)
    html += Object.values(context.teleports ?? {}).join('')
    // 组件在 setup 里起的异步任务可能在渲染结束后才报错，多等一轮再收集。
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  catch (error) {
    problems.push(`渲染抛错：${describeError(error)}`)
  }
  finally {
    restore()
  }

  if (problems.length === 0 && isEmptyHtml(html) && !fixture.allowEmpty)
    problems.push('渲染结果是空的。组件本来就不输出 HTML 时，在 ssr-smoke.fixtures.ts 里给它写 allowEmpty 和原因。')

  if (problems.length > 0)
    throw new Error(`${name} 没法在服务端渲染：\n${problems.join('\n')}`)
}

describe('ssr smoke harness', () => {
  const cases: [string, Component][] = [
    ['window', defineComponent({ setup: () => () => h('div', String((globalThis as any).window.innerWidth)) })],
    ['document', defineComponent({ setup: () => () => h('div', String((globalThis as any).document.title)) })],
    ['navigator', defineComponent({ setup: () => () => h('div', String((globalThis as any).navigator.language)) })],
    ['Vue 警告', defineComponent({ props: { label: { type: String, required: true } }, setup: () => () => h('div', 'x') })],
    ['空输出', defineComponent({ setup: () => () => null })],
  ]

  for (const [label, component] of cases) {
    it(`rejects a component that hits ${label}`, async () => {
      await expect(renderSmoke(`HarnessProbe`, component)).rejects.toThrow('没法在服务端渲染')
    })
  }

  it('puts navigator back after rendering', async () => {
    await expect(renderSmoke('HarnessProbe', cases[2][1])).rejects.toThrow()
    expect(typeof navigator).toBe('object')
  })
})

describe('ssr smoke', () => {
  let consoleWarn: ReturnType<typeof vi.spyOn>
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarn.mockRestore()
    consoleError.mockRestore()
  })

  it('finds the public components', () => {
    expect(components.length).toBeGreaterThan(100)
  })

  it('lists only exported components in the known-failure list', () => {
    const stale = Object.keys(KNOWN_FAILURES).filter(name => !componentNames.has(name))
    expect(stale, `这些名字已经不是公开组件，请从 ssr-known-failures.json 删掉：${stale.join('、')}`).toEqual([])
  })

  it('lists only exported components in the fixture table', () => {
    const stale = Object.keys(ssrFixtures).filter(name => !componentNames.has(name))
    expect(stale, `这些名字已经不是公开组件，请从 ssr-smoke.fixtures.ts 删掉：${stale.join('、')}`).toEqual([])
  })

  for (const [name, component] of components) {
    const reason = KNOWN_FAILURES[name]
    if (reason) {
      // 修好以后这条会失败：请把它从 ssr-known-failures.json 删掉。
      it.fails(`${name}（已知失败：${reason}）`, async () => {
        await renderSmoke(name, component)
        expectNoConsoleOutput(consoleWarn, consoleError)
      })
    }
    else {
      it(name, async () => {
        await renderSmoke(name, component)
        expectNoConsoleOutput(consoleWarn, consoleError)
      })
    }
  }
})

function expectNoConsoleOutput(warn: ReturnType<typeof vi.spyOn>, error: ReturnType<typeof vi.spyOn>): void {
  const calls = [...warn.mock.calls, ...error.mock.calls].map(args => args.map(String).join(' '))
  expect(calls, '渲染期间不该有 console.warn 或 console.error').toEqual([])
}

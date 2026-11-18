import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import CodeBlock from './CodeBlock.vue'

const CODE = 'function greet(name) {\n  return name.trim()\n}'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

/** Chromium 支持 CSS Custom Highlight API，服务端不支持，正是文档站的实际情况。 */
function stubChromium(): void {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36')
  vi.stubGlobal('Highlight', class {
    add(): void {}
    delete(): void {}
  })
  vi.stubGlobal('CSS', {
    escape: (value: string) => value,
    highlights: new Map(),
  })
}

describe('codeBlock hydration', () => {
  it('hydrates server spans without mismatches, then paints with ranges', async () => {
    const Host = defineComponent({
      render: () => h(CodeBlock, { code: CODE, language: 'javascript' }),
    })
    const context: { teleports?: Record<string, string> } = {}
    const html = await renderToString(createSSRApp(Host), context)
    document.body.innerHTML = `${context.teleports?.body ?? ''}<div id="app">${html}</div>`
    const container = document.getElementById('app')!
    expect(container.querySelectorAll('.astryx-code-block__line-content')).toHaveLength(3)

    stubChromium()
    const problems: unknown[] = []
    const app = createSSRApp(Host)
    app.config.warnHandler = message => problems.push(message)
    app.config.errorHandler = error => problems.push(error)
    app.mount(container)
    await nextTick()
    await nextTick()

    expect(problems).toEqual([])
    // 挂载后换成 Highlight API：行内不再有 token span，文本保持原样。
    expect(container.querySelectorAll('.astryx-code-block__line-content')).toHaveLength(0)
    expect(container.querySelector('[data-line="2"]')?.textContent).toBe('  return name.trim()')
    app.unmount()
  })
})

import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
import { resetEntryAnimationForTest } from './testing/resetEntryAnimation.js'
import { useEntryAnimation } from './useEntryAnimation.js'

const Status = defineComponent({
  setup() {
    const { entryClass } = useEntryAnimation()
    return () => h('p', { class: ['status', entryClass] }, 'Required')
  },
})

async function waitForFirstPaint(): Promise<void> {
  await vi.waitFor(() => {
    expect(useEntryAnimation().entryClass).not.toBeNull()
  })
}

beforeEach(() => {
  resetEntryAnimationForTest()
})

afterEach(() => {
  document.body.replaceChildren()
})

describe('useEntryAnimation 和服务端渲染', () => {
  it('hydrates server markup without the entry class, even after the page painted', async () => {
    // 服务端没有画过首屏，标记里没有动画类。
    const html = await renderToString(createSSRApp(Status))
    expect(html).not.toContain('astryx-motion')
    await waitForFirstPaint()

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const problems: unknown[] = []
    const app = createSSRApp(Status)
    app.config.warnHandler = message => problems.push(message)
    app.mount(container)
    await nextTick()

    expect(problems).toEqual([])
    expect(container.querySelector('.status')?.className).toBe('status')
    app.unmount()
  })

  it('still animates an element mounted on the client after the first paint', async () => {
    await waitForFirstPaint()
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(Status)
    app.mount(container)

    expect(container.querySelector('.status')?.classList.contains('astryx-motion-slide-in-below')).toBe(true)
    app.unmount()
  })
})

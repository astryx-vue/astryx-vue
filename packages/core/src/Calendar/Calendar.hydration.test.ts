import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
import Calendar from './Calendar.vue'

afterEach(() => {
  vi.useRealTimers()
  document.body.replaceChildren()
})

const Host = defineComponent({ render: () => h(Calendar) })
const Dated = defineComponent({ render: () => h(Calendar, { focusDate: new Date(2026, 2, 10) }) })

/** 服务端没有 document：把它拿掉再渲染，得到和真实服务端一样的标记。 */
async function serverHtml(component: typeof Host, serverDate: Date): Promise<string> {
  vi.useFakeTimers({ now: serverDate, toFake: ['Date'] })
  const realDocument = globalThis.document
  vi.stubGlobal('document', undefined)
  try {
    return await renderToString(createSSRApp(component))
  }
  finally {
    vi.stubGlobal('document', realDocument)
    vi.useRealTimers()
  }
}

describe('calendar 和服务端渲染', () => {
  it('server in another day: hydrates with no mismatch, then shows the browser\'s month and today', async () => {
    const html = await serverHtml(Host, new Date(2031, 0, 31, 23, 30))
    expect(html).not.toContain('January 2031')
    expect(html).toContain('data-month-pending')
    document.body.innerHTML = `<div id="app">${html}</div>`
    vi.useFakeTimers({ now: new Date(2026, 5, 2, 9, 0), toFake: ['Date'] })

    const problems: unknown[] = []
    const app = createSSRApp(Host)
    app.config.warnHandler = message => problems.push(message)
    app.config.errorHandler = error => problems.push(error)
    app.mount(document.getElementById('app')!)
    expect(problems).toEqual([])
    await nextTick()

    expect(document.querySelector('.astryx-calendar-month-year')?.textContent).toBe('June 2026')
    expect(document.querySelector('.astryx-calendar')?.hasAttribute('data-month-pending')).toBe(false)
    expect(document.querySelector('.astryx-calendar-cell.is-today')?.textContent?.trim()).toBe('2')
    app.unmount()
  })

  it('an explicit focusDate opens its month at once and still marks today after mount', async () => {
    const html = await serverHtml(Dated, new Date(2031, 0, 31))
    expect(html).toContain('March 2026')
    document.body.innerHTML = `<div id="app">${html}</div>`
    vi.useFakeTimers({ now: new Date(2026, 2, 12), toFake: ['Date'] })
    const app = createSSRApp(Dated)
    app.mount(document.getElementById('app')!)
    await nextTick()
    expect(document.querySelector('.astryx-calendar-month-year')?.textContent).toBe('March 2026')
    expect(document.querySelector('.astryx-calendar-cell.is-today')?.textContent?.trim()).toBe('12')
    app.unmount()
  })

  it('a browser-only mount knows today at once', () => {
    vi.useFakeTimers({ now: new Date(2026, 5, 2), toFake: ['Date'] })
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(Host)
    app.mount(container)
    expect(container.querySelector('.astryx-calendar-month-year')?.textContent).toBe('June 2026')
    app.unmount()
  })
})

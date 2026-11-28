import type { App } from 'vue'
import type { Layout } from './chatVirtualizer.testing.js'
import type { ChatVirtualizerExpose, ChatVirtualizerProps } from './chatVirtualizerTypes.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive, ref } from 'vue'
import { createLayout, finger, resetMocks, settle } from './chatVirtualizer.testing.js'
import ChatVirtualizer from './ChatVirtualizer.vue'

vi.mock('@astryx-vue/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core')>()
  const { mockedCore } = await import('./chatVirtualizer.testing.js')
  return { ...actual, ...mockedCore }
})

interface Row { id: number, text: string }
function rows(from: number, to: number): Row[] {
  return Array.from({ length: to - from }, (_, i) => ({ id: from + i, text: `message ${from + i}` }))
}

let app: App | null = null
let layout: Layout
let host: HTMLElement
const handle = ref<ChatVirtualizerExpose | null>(null)

function mountList(props: Partial<ChatVirtualizerProps<Row>> & { data: Row[] }, heights: (key: string) => number = () => 100) {
  host = document.createElement('div')
  document.body.appendChild(host)
  layout = createLayout(host, { viewHeight: 400, rowHeight: heights })
  const state = reactive({ estimatedItemSize: 100, scrollElement: host, ...props }) as ChatVirtualizerProps<Row>
  app = createApp({
    render: () => h(ChatVirtualizer as never, {
      ...state,
      getRowKey: (row: Row) => row.id,
      ref: handle,
    }, { default: ({ item }: { item: Row }) => h('span', item.text) }),
  })
  app.mount(host)
  return state
}

beforeEach(() => {
  resetMocks()
})
afterEach(() => {
  app?.unmount()
  app = null
  layout?.restore()
  host?.remove()
})

describe('chatVirtualizer: windowing and follow-at-end', () => {
  it('mounts only the rows near the viewport and lands at the end', async () => {
    mountList({ data: rows(0, 1000) })
    await settle(layout)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
    const keys = layout.mountedKeys()
    expect(keys).toContain('999')
    // 视口 400 + 上方 1600 余量：大约 20 多行，远小于 1000。
    expect(keys.length).toBeLessThan(30)
    expect(keys).not.toContain('0')
  })

  it('keeps following when a message is appended at the end', async () => {
    const state = mountList({ data: rows(0, 200) })
    await settle(layout)
    state.data = rows(0, 201)
    await settle(layout)
    expect(layout.mountedKeys()).toContain('200')
    expect(layout.scrollTop()).toBe(layout.maxScroll())
  })

  it('stops following once the reader scrolls up, and the row on top stays put', async () => {
    const state = mountList({ data: rows(0, 200) })
    await settle(layout)
    layout.moveTo(layout.scrollTop() - 1000)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    const before = layout.scrollTop()
    const topKey = layout.mountedKeys().find(key => (layout.rowTop(key) ?? -1) >= 0)!
    const topAt = layout.rowTop(topKey)
    state.data = rows(0, 205)
    await settle(layout)
    expect(layout.scrollTop()).toBe(before)
    expect(layout.rowTop(topKey)).toBe(topAt)
  })

  it('follows again after the reader scrolls back to the bottom', async () => {
    const state = mountList({ data: rows(0, 200) })
    await settle(layout)
    layout.moveTo(layout.scrollTop() - 1000)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    layout.moveTo(layout.maxScroll() - 10)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    state.data = rows(0, 203)
    await settle(layout)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
  })
})

describe('chatVirtualizer: position stays while things change above', () => {
  it('loading older history above does not move the row the reader is on', async () => {
    const state = mountList({ data: rows(1000, 1100) }, key => (Number(key) < 1000 ? 60 + (Number(key) % 7) * 20 : 100))
    await settle(layout)
    layout.moveTo(2000)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    const key = layout.mountedKeys().find(k => (layout.rowTop(k) ?? -1) >= 0)!
    const at = layout.rowTop(key)
    state.data = [...rows(900, 1000), ...state.data]
    await settle(layout, 12)
    expect(layout.rowTop(key)).toBe(at)
  })

  it('a row above the view that grows does not push the reader down', async () => {
    const heights = new Map<string, number>()
    mountList({ data: rows(0, 100) }, key => heights.get(key) ?? 100)
    await settle(layout)
    layout.moveTo(4000)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    const mounted = layout.mountedKeys()
    const key = mounted.find(k => (layout.rowTop(k) ?? -1) >= 0)!
    const above = mounted[mounted.indexOf(key) - 2]
    const at = layout.rowTop(key)
    heights.set(above, 260)
    await settle(layout)
    expect(layout.rowTop(key)).toBe(at)
  })

  it('anchorToKey puts the row at the top of the view', async () => {
    mountList({ data: rows(0, 300) })
    await settle(layout)
    handle.value!.anchorToKey('120')
    await settle(layout)
    expect(layout.rowTop('120')).toBe(0)
    handle.value!.scrollToDistanceFromBottomPx(0)
    await settle(layout)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
  })

  it('anchorToKey with a key that is not in the data falls back to the end', async () => {
    mountList({ data: rows(0, 300) })
    await settle(layout)
    handle.value!.anchorToKey('missing')
    await settle(layout)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
  })
})

describe('chatVirtualizer: host scroller and accessibility', () => {
  it('turns the browser scroll anchoring off on the host and hands it back on unmount', async () => {
    mountList({ data: rows(0, 10) })
    await settle(layout, 2)
    host.style.overflowAnchor = 'auto'
    expect(host.getAttribute('data-astryx-scroll-anchoring')).toBe('off')
    app!.unmount()
    app = null
    expect(host.hasAttribute('data-astryx-scroll-anchoring')).toBe(false)
    expect(host.style.overflowAnchor).toBe('auto')
  })

  it('renders nothing but spacers while the attach element is pending', async () => {
    mountList({ data: rows(0, 10), scrollElement: null })
    await nextTick()
    expect(layout.mountedKeys()).toEqual([])
    expect(host.querySelector('.astryx-chat-virtualizer')).toBeNull()
  })

  it('marks rows the window moves over as busy, and a new tail message not', async () => {
    const state = mountList({ data: rows(0, 200) })
    await settle(layout)
    await settle(layout)
    expect(layout.content()!.hasAttribute('aria-busy')).toBe(false)
    state.data = rows(0, 201)
    await nextTick()
    await nextTick()
    expect(layout.mountedKeys()).toContain('200')
    expect(layout.content()!.hasAttribute('aria-busy')).toBe(false)
    layout.moveTo(0)
    host.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(layout.content()!.getAttribute('aria-busy')).toBe('true')
    await settle(layout)
    expect(layout.content()!.hasAttribute('aria-busy')).toBe(false)
  })

  it('keeps a focused row mounted while the window moves away from it', async () => {
    mountList({ data: rows(0, 200) })
    await settle(layout)
    const row = host.querySelector<HTMLElement>('[data-pkey="195"]')!
    row.tabIndex = 0
    row.focus()
    row.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    layout.moveTo(0)
    host.dispatchEvent(new Event('scroll'))
    await settle(layout)
    expect(layout.mountedKeys()).toContain('0')
    expect(layout.mountedKeys()).toContain('195')
    expect(host.querySelector('[data-pkey="195"]')).toBe(row)
  })
})

describe('chatVirtualizer: finger scroll', () => {
  it('writes no scrollTop while a finger scrolls, and hands the position back where the finger left it', async () => {
    const state = mountList({ data: rows(0, 200) }, key => (Number(key) >= 200 ? 180 : 100))
    await settle(layout)
    finger.active = true
    layout.moveTo(layout.scrollTop() - 300)
    host.dispatchEvent(new Event('scroll'))
    const key = layout.mountedKeys().find(k => (layout.rowTop(k) ?? -1) >= 0)!
    const at = layout.rowTop(key)
    const writes = layout.listWrites
    state.data = rows(0, 204)
    await settle(layout)
    expect(layout.listWrites).toBe(writes)
    finger.active = false
    finger.onEnd?.()
    await settle(layout)
    expect(layout.rowTop(key)).toBe(at)
    state.data = rows(0, 206)
    await settle(layout)
    expect(layout.rowTop(key)).toBe(at)
  })
})

describe('chatVirtualizer: own scroll container', () => {
  it('names its own scroller as a group keyboard users can reach', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const own = createApp({
      render: () => h(ChatVirtualizer as never, { data: rows(0, 3), getRowKey: (r: Row) => r.id, class: 'mine' }),
    })
    own.mount(el)
    await nextTick()
    const scroller = el.querySelector('.astryx-chat-virtualizer')!
    expect(scroller.getAttribute('role')).toBe('group')
    expect(scroller.getAttribute('aria-label')).toBe('Messages')
    expect(scroller.classList.contains('mine')).toBe(true)
    own.unmount()
    el.remove()
  })
})

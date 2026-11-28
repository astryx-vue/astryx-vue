import type { App } from 'vue'
import type { Layout } from './chatVirtualizer.testing.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, reactive } from 'vue'
import { createLayout, finger, resetMocks, settle } from './chatVirtualizer.testing.js'
import ChatVirtualizer from './ChatVirtualizer.vue'

vi.mock('@astryx-vue/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core')>()
  const { mockedCore } = await import('./chatVirtualizer.testing.js')
  return { ...actual, ...mockedCore }
})

interface Row { id: number }
const rows = (n: number): Row[] => Array.from({ length: n }, (_, id) => ({ id }))

const HEADER = 92
const ROW = 100
const PORTRAIT_ROW = 150

let app: App | null = null
let layout: Layout
let mountPoint: HTMLElement
let rowHeight = ROW
const page = document.documentElement

function mountOnPage(data: Row[]): void {
  rowHeight = ROW
  mountPoint = document.createElement('div')
  document.body.appendChild(mountPoint)
  layout = createLayout(page, { viewHeight: 400, rowHeight: () => rowHeight, header: HEADER })
  const state = reactive({ data, estimatedItemSize: ROW, scrollElement: page })
  app = createApp({
    render: () => h(ChatVirtualizer as never, { ...state, getRowKey: (row: Row) => row.id }, { default: ({ item }: { item: Row }) => h('span', String(item.id)) }),
  })
  app.mount(mountPoint)
}

/** 浏览器（或读者）把整页滚到 `y`：页面的滚动事件发在 document 上。 */
function pageScroll(y: number): void {
  layout.moveTo(y)
  document.dispatchEvent(new Event('scroll'))
}

/** 读到历史中间，让 `key` 那一行顶边贴着视口顶。 */
async function readAt(key: number): Promise<void> {
  pageScroll(HEADER + key * ROW)
  await settle(layout)
}

/**
 * 手机旋转：视口变高、行变高，浏览器自己按比例写一次 scrollTop。
 * 滚动事件可能先于 resize 事件到，但那时视口的尺寸已经是新的了。
 */
function rotate(order: 'scroll-first' | 'resize-first'): void {
  const scaled = layout.scrollTop() * (PORTRAIT_ROW / ROW)
  layout.viewHeight = 700
  rowHeight = PORTRAIT_ROW
  const resize = (): void => {
    window.dispatchEvent(new Event('resize'))
  }
  if (order === 'resize-first') {
    resize()
    pageScroll(scaled)
  }
  else {
    pageScroll(scaled)
    resize()
  }
}

beforeEach(() => {
  resetMocks()
})
afterEach(() => {
  app?.unmount()
  app = null
  layout?.restore()
  mountPoint?.remove()
})

describe('chatVirtualizer attached to the page scroller', () => {
  it('measures where its content starts against the viewport, not the moving page box', async () => {
    mountOnPage(rows(10_000))
    await settle(layout)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
    await readAt(40)
    expect(layout.rowTop('40')).toBe(0)
    pageScroll(layout.scrollTop() + 250)
    await settle(layout)
    expect(layout.mountedKeys().some((key) => {
      const top = layout.rowTop(key)!
      return top >= 0 && top < 400
    })).toBe(true)
    expect(layout.scrollTop()).toBe(HEADER + 40 * ROW + 250)
  })

  it('listens for the page scroll on the document', async () => {
    mountOnPage(rows(500))
    await settle(layout)
    await readAt(10)
    expect(layout.mountedKeys()).toContain('10')
    expect(layout.mountedKeys()).not.toContain('499')
  })
})

describe('chatVirtualizer on the page scroller: rotation', () => {
  it('keeps the row at the top of the view when the browser scales the position after the resize', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    await readAt(120)
    rotate('resize-first')
    await settle(layout, 12)
    expect(layout.rowTop('120')).toBe(0)
  })

  it('keeps the row at the top of the view when the browser scrolls before the resize event', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    await readAt(120)
    rotate('scroll-first')
    await settle(layout, 12)
    expect(layout.rowTop('120')).toBe(0)
  })

  it('restores the row when the browser writes its scroll late, after the pass settled', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    await readAt(120)
    rotate('resize-first')
    await settle(layout, 6)
    pageScroll(layout.scrollTop() + 333)
    await settle(layout, 6)
    expect(layout.rowTop('120')).toBe(0)
  })

  it('keeps following the end through a rotation', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    rotate('resize-first')
    await settle(layout, 12)
    expect(layout.scrollTop()).toBe(layout.maxScroll())
  })

  it('follows the reader’s own key scroll right after a rotation', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    await readAt(120)
    rotate('resize-first')
    await settle(layout, 6)
    // 按键处理函数阻止了冒泡也一样：列表在捕获阶段听。
    const stop = (event: Event): void => event.stopPropagation()
    mountPoint.addEventListener('keydown', stop)
    mountPoint.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
    mountPoint.removeEventListener('keydown', stop)
    const target = layout.scrollTop() + 500
    pageScroll(target)
    await settle(layout, 6)
    expect(layout.scrollTop()).toBe(target)
  })

  it('leaves the position to a finger that scrolls during the rotation', async () => {
    mountOnPage(rows(300))
    await settle(layout)
    await readAt(120)
    finger.active = true
    layout.viewHeight = 700
    window.dispatchEvent(new Event('resize'))
    const writes = layout.listWrites
    pageScroll(layout.scrollTop() - 200)
    await settle(layout, 6)
    expect(layout.listWrites).toBe(writes)
  })
})

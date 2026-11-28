/**
 * ChatVirtualizer 测试用的版面模型。happy-dom 没有布局，也没有 ResizeObserver，
 * 这里替浏览器算：行高按模型给，spacer 按写上去的 style，scrollHeight 是内容总高，
 * scrollTop 夹在可滚动范围里；列表自己写的 scrollTop 下一帧发一个滚动事件。
 * 测试文件用 vi.mock 把 core 的 observeResize 和 unstable_useFingerScroll 换成 mockedCore。
 */

type ResizeCallback = (entry: ResizeObserverEntry) => void

const observed = new Map<Element, ResizeCallback>()
const delivered = new Map<Element, number>()

/** 测试控制的手指滚动：`active` 为真时列表读到的是手指在滚。 */
export const finger: { active: boolean, onEnd: (() => void) | null } = { active: false, onEnd: null }

export const mockedCore = {
  observeResize(element: Element, callback: ResizeCallback): () => void {
    observed.set(element, callback)
    callback({ target: element } as ResizeObserverEntry)
    return () => {
      if (observed.get(element) === callback) {
        observed.delete(element)
        delivered.delete(element)
      }
    }
  },
  unstable_useFingerScroll(_scroller: unknown, options: { onEnd?: () => void } = {}): () => boolean {
    finger.onEnd = options.onEnd ?? null
    return () => finger.active
  },
}

export interface Layout {
  el: HTMLElement
  /** 内容块上方调用方自己的内容高度。 */
  header: number
  viewHeight: number
  rowHeight: (key: string) => number
  /** 列表写 scrollTop 的次数。 */
  listWrites: number
  /** 浏览器（或读者）把位置挪到 `y`，不算列表写的，不自动发事件。 */
  moveTo: (y: number) => void
  scrollTop: () => number
  maxScroll: () => number
  /** 某一行顶边离视口顶边多远；没挂载时为 null。 */
  rowTop: (key: string) => number | null
  mountedKeys: () => string[]
  content: () => HTMLElement | null
  restore: () => void
}

const SPACER_PROPS = ['height'] as const

function blockOf(el: HTMLElement): HTMLElement | null {
  return el.querySelector<HTMLElement>('.astryx-chat-virtualizer__content')
}

export function createLayout(el: HTMLElement, options: { viewHeight: number, rowHeight: (key: string) => number, header?: number }): Layout {
  let top = 0
  const isPage = el === el.ownerDocument.documentElement
  const layout: Layout = {
    el,
    header: options.header ?? 0,
    viewHeight: options.viewHeight,
    rowHeight: options.rowHeight,
    listWrites: 0,
    moveTo: (y) => {
      top = y
    },
    scrollTop: () => el.scrollTop,
    maxScroll: () => Math.max(0, el.scrollHeight - layout.viewHeight),
    rowTop: (key) => {
      const row = blockOf(el)?.querySelector<HTMLElement>(`[data-pkey="${CSS.escape(key)}"]`)
      return row ? row.getBoundingClientRect().top : null
    },
    mountedKeys: () => [...(blockOf(el)?.querySelectorAll<HTMLElement>('[data-pkey]') ?? [])].map(row => row.dataset.pkey!),
    content: () => blockOf(el),
    restore: () => {},
  }
  const heightOf = (node: Element): number => {
    const html = node as HTMLElement
    if (html.dataset?.pkey !== undefined)
      return layout.rowHeight(html.dataset.pkey)
    for (const prop of SPACER_PROPS) {
      const px = Number.parseFloat(html.style?.[prop] ?? '')
      if (!Number.isNaN(px))
        return px
    }
    return 0
  }
  const contentHeight = (): number => {
    const block = blockOf(el)
    if (!block)
      return 0
    let sum = 0
    for (const child of block.children)
      sum += heightOf(child)
    return Math.max(sum, Number.parseFloat(block.style.minHeight) || 0)
  }
  const scrollHeight = (): number => Math.max(layout.viewHeight, layout.header + contentHeight())
  const clamp = (y: number): number => Math.max(0, Math.min(y, scrollHeight() - layout.viewHeight))

  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => clamp(top),
    set: (value: number) => {
      const before = clamp(top)
      top = value
      layout.listWrites++
      if (clamp(top) !== before) {
        requestAnimationFrame(() => {
          const target = isPage ? el.ownerDocument : el
          target.dispatchEvent(new Event('scroll'))
        })
      }
    },
  })
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => layout.viewHeight })
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: scrollHeight })

  const proto = HTMLElement.prototype
  const rectDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect')!
  const offsetDescriptor = Object.getOwnPropertyDescriptor(proto, 'offsetHeight')
  Object.defineProperty(proto, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return heightOf(this)
    },
  })
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: Element) {
      const block = blockOf(el)
      const rect = (y: number, h: number): DOMRect => ({ top: y, bottom: y + h, height: h, left: 0, right: 400, width: 400, x: 0, y }) as DOMRect
      if (this === el)
        return rect(0, layout.viewHeight)
      if (block === null)
        return rect(0, 0)
      const blockTop = layout.header - clamp(top)
      if (this === block)
        return rect(blockTop, contentHeight())
      if (this.parentElement !== block)
        return rect(0, 0)
      let y = blockTop
      for (const child of block.children) {
        if (child === this)
          return rect(y, heightOf(child))
        y += heightOf(child)
      }
      return rect(0, 0)
    },
  })
  layout.restore = () => {
    Object.defineProperty(Element.prototype, 'getBoundingClientRect', rectDescriptor)
    if (offsetDescriptor)
      Object.defineProperty(proto, 'offsetHeight', offsetDescriptor)
    else
      delete (proto as { offsetHeight?: number }).offsetHeight
    for (const prop of ['scrollTop', 'clientHeight', 'scrollHeight'])
      delete (el as unknown as Record<string, unknown>)[prop]
  }
  return layout
}

/** 像浏览器一样，把模型里尺寸变了的被观察元素报给它们的回调。 */
export function deliverSizes(layout: Layout): void {
  for (const [element, callback] of [...observed]) {
    const html = element as HTMLElement
    const isRow = html.dataset?.pkey !== undefined
    if (isRow && !html.isConnected)
      continue
    const isViewport = element === layout.el || html.classList?.contains('astryx-chat-virtualizer__viewport-probe')
    const size = isRow ? layout.rowHeight(html.dataset.pkey!) : isViewport ? layout.viewHeight : -1
    if (size < 0 || delivered.get(element) === size)
      continue
    delivered.set(element, size)
    callback({
      target: element,
      borderBoxSize: [{ blockSize: size, inlineSize: 400 }],
      contentRect: { height: size, width: 400 },
    } as unknown as ResizeObserverEntry)
  }
}

export function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

/** 跑若干帧：每帧报一次尺寸，让修正轮、重试和滚动事件都走完。 */
export async function settle(layout: Layout, frames = 8): Promise<void> {
  for (let i = 0; i < frames; i++) {
    deliverSizes(layout)
    await Promise.resolve()
    await nextFrame()
  }
}

export function resetMocks(): void {
  observed.clear()
  delivered.clear()
  finger.active = false
  finger.onEnd = null
}

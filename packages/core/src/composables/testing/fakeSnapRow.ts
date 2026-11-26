/**
 * 测试用的一行假布局：给滚动行和它的子项装上随 scrollLeft 变化的矩形、
 * 可滚动宽度和可视宽度，让吸附分页能在 happy-dom 里算出停点。
 */
export interface FakeRowLayout {
  /** 可视宽度。 */
  readonly width: number
  /** 每一项的宽度，可以各不相同。 */
  readonly items: readonly number[]
  readonly gap?: number
}

export function layOutRow(element: HTMLElement, layout: FakeRowLayout): void {
  const gap = layout.gap ?? 0
  const lefts: number[] = []
  let x = 0
  for (const width of layout.items) {
    lefts.push(x)
    x += width + gap
  }
  const scrollWidth = Math.max(layout.width, x - gap)
  let scrollLeft = 0
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: layout.width },
    offsetWidth: { configurable: true, value: layout.width },
    scrollWidth: { configurable: true, value: scrollWidth },
    scrollLeft: {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = value
      },
    },
  })
  element.scrollTo = ((options: ScrollToOptions) => {
    scrollLeft = options.left ?? scrollLeft
    element.dispatchEvent(new Event('scroll'))
  }) as HTMLElement['scrollTo']
  element.scrollBy = ((options: ScrollToOptions) => {
    scrollLeft += options.left ?? 0
    element.dispatchEvent(new Event('scroll'))
  }) as HTMLElement['scrollBy']
  element.getBoundingClientRect = () => ({ left: 0, right: layout.width, width: layout.width, top: 0, bottom: 100, height: 100 }) as DOMRect
  Array.from(element.children).forEach((child, index) => {
    const width = layout.items[index] ?? 0
    Object.defineProperty(child, 'offsetWidth', { configurable: true, value: width })
    child.getBoundingClientRect = () => {
      // 从右往左排版时，第一项贴在右边，向左排开；滚动偏移是负数。
      const rtl = getComputedStyle(element).direction === 'rtl'
      const start = lefts[index]! - Math.abs(scrollLeft)
      const left = rtl ? layout.width - start - width : start
      return { left, right: left + width, width, top: 0, bottom: 100, height: 100 } as DOMRect
    }
  })
}

/** 一个装好假布局、挂在 document 上的滚动行。 */
export function fakeRow(layout: FakeRowLayout): HTMLElement {
  const element = document.createElement('div')
  for (let i = 0; i < layout.items.length; i++)
    element.append(document.createElement('div'))
  document.body.append(element)
  layOutRow(element, layout)
  return element
}

function pointer(type: string, init: PointerEventInit): PointerEvent {
  return new PointerEvent(type, { bubbles: true, cancelable: true, isPrimary: true, pointerId: 1, pointerType: 'touch', ...init })
}

/** 手指按下、按给定节奏移动、抬起。每一步之间推进假时钟 `stepMs` 毫秒。 */
export function swipe(
  element: HTMLElement,
  advance: (ms: number) => void,
  xs: readonly number[],
  options: { pointerType?: string, stepMs?: number, y?: readonly number[], lift?: boolean } = {},
): void {
  const pointerType = options.pointerType ?? 'touch'
  const stepMs = options.stepMs ?? 16
  const y = (index: number): number => options.y?.[index] ?? 0
  element.dispatchEvent(pointer('pointerdown', { clientX: xs[0], clientY: y(0), pointerType }))
  for (let i = 1; i < xs.length; i++) {
    advance(stepMs)
    element.dispatchEvent(pointer('pointermove', { clientX: xs[i], clientY: y(i), pointerType }))
  }
  if (options.lift !== false)
    element.dispatchEvent(pointer('pointerup', { clientX: xs[xs.length - 1], clientY: y(xs.length - 1), pointerType }))
}

export function touch(element: HTMLElement, type: 'pointerdown' | 'pointermove' | 'pointerup', x = 0): void {
  element.dispatchEvent(pointer(type, { clientX: x }))
}

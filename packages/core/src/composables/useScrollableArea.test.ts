import type { UseScrollableAreaOptions } from './useScrollableArea.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { attachScrollKeyboardDelegation } from './internal/scrollKeyboardDelegation.js'
import { findNearestScrollOwner, getRegisteredScrollOwnerState } from './internal/scrollOwnerRegistry.js'
import { useScrollableArea } from './useScrollableArea.js'

interface Box {
  clientWidth: number
  clientHeight: number
  scrollWidth: number
  scrollHeight: number
  scrollTop: number
  scrollLeft: number
}

/** happy-dom 没有布局。把几何量挂在视口元素上，overflow 读的是内联样式。 */
function stubBox(element: HTMLElement, box: Box): void {
  for (const key of Object.keys(box) as (keyof Box)[])
    Object.defineProperty(element, key, { configurable: true, get: () => box[key] })
}

function mountArea(options: UseScrollableAreaOptions, box: Box) {
  let area!: ReturnType<typeof useScrollableArea>
  const wrapper = mount(defineComponent({
    setup() {
      area = useScrollableArea(options)
      return () => h('div', {
        class: 'viewport',
        ref: area.viewport,
        ...area.viewportAttrs.value,
        style: area.viewportStyle.value,
      }, [h('div', { ref: area.content }, [h('button', { type: 'button' }, 'Act')])])
    },
  }), { attachTo: document.body })
  const viewport = wrapper.get('.viewport').element as HTMLElement
  stubBox(viewport, box)
  return { area: () => area, viewport, wrapper }
}

async function remeasure(viewport: HTMLElement): Promise<void> {
  viewport.dispatchEvent(new Event('scroll'))
  await Promise.resolve()
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const fitting = (): Box => ({ clientWidth: 200, clientHeight: 100, scrollWidth: 200, scrollHeight: 100, scrollTop: 0, scrollLeft: 0 })
const tall = (): Box => ({ clientWidth: 200, clientHeight: 100, scrollWidth: 200, scrollHeight: 400, scrollTop: 0, scrollLeft: 0 })

describe('useScrollableArea', () => {
  it('放得下时不进 Tab 顺序，overflow 是 clip', async () => {
    const { viewport } = mountArea({ label: 'Files' }, fitting())
    await remeasure(viewport)
    expect(viewport.getAttribute('tabindex')).toBeNull()
    expect(viewport.style.overflowY).toBe('clip')
    expect(viewport.getAttribute('aria-label')).toBe('Files')
  })

  it('真的溢出且能滚时成为 Tab 停靠点，并登记成滚动容器', async () => {
    const { viewport } = mountArea({ label: 'Files' }, tall())
    await remeasure(viewport)
    expect(viewport.style.overflowY).toBe('auto')
    await remeasure(viewport)
    expect(viewport.getAttribute('tabindex')).toBe('0')
    expect(viewport.getAttribute('data-scrollable-block')).toBe('true')
    expect(getRegisteredScrollOwnerState(viewport)?.block.isScrollable).toBe(true)
    const inner = viewport.querySelector('button')!
    expect(findNearestScrollOwner(inner, 'block')).toBe(viewport)
    expect(findNearestScrollOwner(inner, 'inline')).toBeNull()
  })

  it('滚到中间时两头都不在', async () => {
    const box = tall()
    const { viewport } = mountArea({ label: 'Files' }, box)
    await remeasure(viewport)
    await remeasure(viewport)
    box.scrollTop = 150
    await remeasure(viewport)
    expect(viewport.getAttribute('data-scroll-block-start')).toBeNull()
    expect(viewport.getAttribute('data-scroll-block-end')).toBeNull()
  })

  it('keyboardAccess 为 content 时视口不带名字、不进 Tab 顺序', async () => {
    const { viewport } = mountArea({ keyboardAccess: { owner: 'content' } }, tall())
    await remeasure(viewport)
    await remeasure(viewport)
    expect(viewport.getAttribute('role')).toBeNull()
    expect(viewport.getAttribute('tabindex')).toBeNull()
  })

  it('量不出来（宽高为 0）时保留上一次的结果', async () => {
    const box = tall()
    const { viewport } = mountArea({ label: 'Files' }, box)
    await remeasure(viewport)
    await remeasure(viewport)
    box.clientWidth = 0
    box.clientHeight = 0
    await remeasure(viewport)
    expect(viewport.getAttribute('data-scrollable-block')).toBe('true')
  })

  it('卸载时从登记表里拿掉', async () => {
    const { viewport, wrapper } = mountArea({ label: 'Files' }, tall())
    await remeasure(viewport)
    await remeasure(viewport)
    wrapper.unmount()
    expect(getRegisteredScrollOwnerState(viewport)).toBeUndefined()
  })
})

describe('焦点进入时的滚动键盘委托', () => {
  function setup(markup: string) {
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([new DOMRect(0, 0, 20, 20)] as unknown as DOMRectList)
    const before = document.body.appendChild(document.createElement('button'))
    const viewport = document.body.appendChild(document.createElement('div'))
    viewport.tabIndex = 0
    const content = viewport.appendChild(document.createElement('div'))
    content.innerHTML = markup
    const detach = attachScrollKeyboardDelegation(viewport, content)
    const enter = (shiftKey = false): void => {
      before.focus()
      before.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true }))
      viewport.focus()
    }
    return { before, content, detach, enter, viewport }
  }

  it('tab 进来、第一个是普通按钮时，焦点直接交给它', () => {
    const { content, detach, enter } = setup('<button type="button">First</button><a href="#">Second</a>')
    enter()
    expect(document.activeElement).toBe(content.querySelector('button'))
    detach()
  })

  it('第一个是弹出菜单按钮、可编辑区域或有交互角色的包裹时不委托', () => {
    for (const markup of [
      '<button type="button" aria-haspopup="menu">Menu</button>',
      '<div role="listbox"><button type="button">Row</button></div>',
      '<div contenteditable="true"><button type="button">X</button></div>',
    ]) {
      const { detach, enter, viewport } = setup(markup)
      enter()
      expect(document.activeElement).toBe(viewport)
      detach()
      document.body.innerHTML = ''
    }
  })

  it('指针聚焦、Shift+Tab 进来都不委托', () => {
    const { detach, enter, viewport } = setup('<button type="button">First</button>')
    viewport.focus()
    expect(document.activeElement).toBe(viewport)
    viewport.blur()
    enter(true)
    expect(document.activeElement).toBe(viewport)
    detach()
  })

  it('从委托出去的按钮 Shift+Tab 时，视口暂时退出 Tab 顺序，之后还原', async () => {
    vi.useFakeTimers()
    const { content, detach, enter, viewport } = setup('<button type="button">First</button>')
    enter()
    const button = content.querySelector('button')!
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    expect(viewport.tabIndex).toBe(-1)
    vi.runAllTimers()
    expect(viewport.getAttribute('tabindex')).toBe('0')
    detach()
    vi.useRealTimers()
  })
})

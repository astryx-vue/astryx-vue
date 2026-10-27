import type { VueWrapper } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import InfoTip from './InfoTip.vue'

enableAutoUnmount(afterEach)

// happy-dom 里 :focus-visible 不会自己成立。键盘用户落到按钮上时它应当是 true，
// 这里把「当前聚焦元素」当成键盘聚焦，其余选择器交给原实现。
const originalMatches = HTMLElement.prototype.matches

beforeEach(() => {
  vi.useFakeTimers()
  HTMLElement.prototype.matches = function (this: HTMLElement, selector: string) {
    if (selector === ':focus-visible')
      return this === document.activeElement
    return originalMatches.call(this, selector)
  }
})

afterEach(() => {
  vi.useRealTimers()
  HTMLElement.prototype.matches = originalMatches
  document.body.innerHTML = ''
})

function renderInfoTip(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(InfoTip, { attachTo: document.body, props, slots })
  const trigger = wrapper.get('.astryx-info-tip').element as HTMLElement
  const bubble = document.querySelector('[role="tooltip"]') as HTMLElement
  return { wrapper, trigger, bubble }
}

function isShown(bubble: HTMLElement): boolean {
  return bubble.style.display !== 'none'
}

/** 手指点一下：触摸指针序列，之后浏览器补发 mouseenter。 */
function tap(element: HTMLElement) {
  element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))
  element.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }))
  element.dispatchEvent(new MouseEvent('mouseenter'))
}

async function show(wrapper: VueWrapper, trigger: HTMLElement) {
  trigger.dispatchEvent(new MouseEvent('mouseenter'))
  vi.advanceTimersByTime(200)
  await nextTick()
  return wrapper
}

describe('infoTip', () => {
  it('renders a button trigger with the default accessible name', () => {
    const { trigger } = renderInfoTip()
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.getAttribute('type')).toBe('button')
    expect(trigger.getAttribute('aria-label')).toBe('More information')
  })

  it('uses a custom label as the accessible name', () => {
    const { trigger } = renderInfoTip({ content: '30-day rolling average.', label: 'About this metric' })
    expect(trigger.getAttribute('aria-label')).toBe('About this metric')
  })

  it('links the trigger to the tooltip layer via aria-describedby', () => {
    const { trigger, bubble } = renderInfoTip({ content: 'Helpful context' })
    expect(bubble.textContent).toContain('Helpful context')
    expect(trigger.getAttribute('aria-describedby')).toBe(bubble.id)
  })

  it('is reachable with Tab', () => {
    const { trigger } = renderInfoTip()
    // 真按钮，没有把 tabindex 改成 -1，Tab 顺序里能落到它。
    expect(trigger.tabIndex).toBe(0)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)
  })

  it('shows the tooltip on hover', async () => {
    const { trigger, bubble } = renderInfoTip()
    trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(isShown(bubble)).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(isShown(bubble)).toBe(true)
  })

  it('shows the tooltip on keyboard focus', async () => {
    const { trigger, bubble } = renderInfoTip()
    trigger.focus()
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(isShown(bubble)).toBe(true)
  })

  it('closes the tooltip on Escape', async () => {
    const { trigger, bubble } = renderInfoTip()
    await show(undefined as unknown as VueWrapper, trigger)
    expect(isShown(bubble)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(isShown(bubble)).toBe(false)
  })

  it('re-opens after Escape once the trigger is left and re-hovered', async () => {
    const { trigger, bubble } = renderInfoTip()
    trigger.focus()
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(isShown(bubble)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(isShown(bubble)).toBe(false)

    trigger.blur()
    trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    trigger.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(500)

    trigger.dispatchEvent(new Event('pointerenter'))
    trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(isShown(bubble)).toBe(true)
  })

  it('renders rich tooltip content from the content slot', () => {
    const { bubble } = renderInfoTip({ content: 'ignored when the slot is used' }, { content: '<span data-testid="rich-content">Rich</span>' })
    expect(bubble.querySelector('[data-testid="rich-content"]')?.textContent).toBe('Rich')
  })

  describe('touch', () => {
    it('opens on a tap, though the trigger is a button', async () => {
      const { trigger, bubble } = renderInfoTip({ content: '30-day rolling average.' })
      tap(trigger)
      await nextTick()
      // 按钮是 true 动作元素，Tooltip 的 `auto` 规则会把这次轻点让给按钮；
      // InfoTip 明确选了 `tap`，因为弹气泡就是这个按钮的全部作用。
      expect(isShown(bubble)).toBe(true)
    })

    it('closes on a second tap of the trigger', async () => {
      const { trigger, bubble } = renderInfoTip({ content: '30-day rolling average.' })
      tap(trigger)
      await nextTick()
      expect(isShown(bubble)).toBe(true)

      tap(trigger)
      await nextTick()
      expect(isShown(bubble)).toBe(false)
    })

    // 上游还有一条「点气泡外面关闭」。core 的 Tooltip 目前把 hover 层登记成
    // dismissOnPointerOutside: false，点外面不会关；这是 core 浮层关闭栈的事
    // （B4 / C7），lab 这边不重复实现，见回报。
  })

  it('renders on the server without throwing', async () => {
    const app = createSSRApp({ render: () => h(InfoTip, { content: 'Helpful context', label: 'About' }) })
    const html = await renderToString(app)
    expect(html).toContain('class="astryx-info-tip"')
    expect(html).toContain('aria-label="About"')
  })
})

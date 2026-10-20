import type { UseHoverCardOptions, UseHoverCardReturn } from './useHoverCard.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useHoverCard } from './useHoverCard.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function pointerEvent(type: string, pointerType: string): Event {
  const event = new Event(type, { bubbles: true })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  return event
}

function setupHoverCard(
  options: UseHoverCardOptions = {},
  tagName = 'button',
  attrs: Record<string, string> = {},
) {
  let card: UseHoverCardReturn | undefined
  const trigger = document.createElement(tagName)
  trigger.textContent = 'Trigger'
  for (const [name, value] of Object.entries(attrs))
    trigger.setAttribute(name, value)
  document.body.append(trigger)
  const content = document.createElement('div')
  document.body.append(content)

  const wrapper = mount(defineComponent({
    setup() {
      card = useHoverCard(options)
      card.contentRef.value = content
      card.triggerRef.value = trigger
      return () => h('div')
    },
  }))
  return { card: card!, trigger, content, wrapper }
}

describe('useHoverCard', () => {
  it('默认以没有名字的 group 暴露，并把 ID 写进 aria-describedby', () => {
    const { card, trigger } = setupHoverCard()

    expect(card.isDialog.value).toBe(false)
    expect(card.contentProps.value.role).toBe('group')
    expect(card.contentProps.value['aria-label']).toBeUndefined()
    expect(trigger.getAttribute('aria-describedby')).toBe(card.id)
  })

  it('给了 label 就以 dialog 暴露，触发器宣告 haspopup / controls / expanded', async () => {
    const { card, trigger } = setupHoverCard({ delay: 0, label: 'Project details' })

    expect(card.isDialog.value).toBe(true)
    expect(card.contentProps.value.role).toBe('dialog')
    expect(card.contentProps.value['aria-label']).toBe('Project details')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.hasAttribute('aria-controls')).toBe(false)

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(card.id)
  })

  it('悬停延迟到点才显示，离开后等 hideDelay 再隐藏', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()
    const { card, trigger } = setupHoverCard({ delay: 300, hideDelay: 200, onShow, onHide })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(299)
    await nextTick()
    expect(card.isOpen.value).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(card.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()

    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(card.isOpen.value).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(card.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('指针移进卡片后保持显示，移出再关闭', async () => {
    const { card, trigger } = setupHoverCard({ delay: 0, hideDelay: 200 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger.dispatchEvent(new Event('mouseleave'))

    // 组件把 contentProps 摊到卡片元素上，这里直接调用它给出的处理函数。
    ;(card.contentProps.value.onMouseenter as () => void)()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(card.isOpen.value).toBe(true)

    ;(card.contentProps.value.onMouseleave as () => void)()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(card.isOpen.value).toBe(false)
  })

  it('键盘焦点立即打开，焦点离开后按 hideDelay 关闭', async () => {
    const { card, trigger } = setupHoverCard({ hideDelay: 200 })

    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(card.isOpen.value).toBe(true)

    trigger.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }))
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(card.isOpen.value).toBe(false)
  })

  it('调用 show / hide 立即生效并上报', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()
    const { card } = setupHoverCard({ onShow, onHide })

    card.show()
    await nextTick()
    expect(card.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()

    card.hide()
    await nextTick()
    expect(card.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('受控时悬停不改变状态，Escape 只上报', async () => {
    const controlled = ref<boolean | undefined>(true)
    const onHide = vi.fn()
    const { card, trigger } = setupHoverCard({ isOpen: controlled, onHide })

    expect(card.isOpen.value).toBe(true)

    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(card.isOpen.value).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(card.isOpen.value).toBe(true)
    expect(onHide).toHaveBeenCalledOnce()

    controlled.value = false
    await nextTick()
    expect(card.isOpen.value).toBe(false)
  })

  it('escape 关闭时把焦点交回触发器', async () => {
    const { card, trigger, content } = setupHoverCard({ isDefaultOpen: true, label: 'Details' })
    await nextTick()

    const inside = document.createElement('button')
    content.append(inside)
    inside.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(card.isOpen.value).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('isEnabled 为 false 时悬停和焦点都不打开', async () => {
    const enabled = ref(false)
    const { card, trigger } = setupHoverCard({ delay: 0, isEnabled: enabled })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(1000)
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()

    expect(card.isOpen.value).toBe(false)
  })

  it('触摸轻点在自己有动作的触发器上不打开，切到 tap 才打开', async () => {
    const action = setupHoverCard()
    action.trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
    action.trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
    await nextTick()
    expect(action.card.isOpen.value).toBe(false)

    document.body.innerHTML = ''
    const tapped = setupHoverCard({ touchTrigger: 'tap' })
    tapped.trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
    tapped.trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
    await nextTick()
    expect(tapped.card.isOpen.value).toBe(true)
  })

  it('触摸轻点卡片外部会关闭', async () => {
    const { card, trigger } = setupHoverCard({}, 'span')

    trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
    trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
    await nextTick()
    expect(card.isOpen.value).toBe(true)

    document.body.dispatchEvent(pointerEvent('pointerdown', 'touch'))
    await nextTick()
    expect(card.isOpen.value).toBe(false)
  })

  it('卸载时还原触发器原有的 popup 属性', () => {
    const { trigger, wrapper } = setupHoverCard(
      { label: 'Details' },
      'button',
      { 'aria-haspopup': 'menu', 'aria-controls': 'existing-menu' },
    )
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')

    wrapper.unmount()

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-controls')).toBe('existing-menu')
  })
})

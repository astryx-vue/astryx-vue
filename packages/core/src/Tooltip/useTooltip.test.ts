import type { UseTooltipOptions, UseTooltipReturn } from './useTooltip.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useTooltip } from './useTooltip.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function setupTooltip(options: UseTooltipOptions = {}) {
  let tooltip: UseTooltipReturn | undefined
  let trigger: HTMLButtonElement | null = null
  const wrapper = mount(defineComponent({
    setup() {
      tooltip = useTooltip(options)
      return () => h('div')
    },
    mounted() {
      trigger = document.createElement('button')
      trigger.textContent = 'Trigger'
      document.body.append(trigger)
      tooltip!.triggerRef.value = trigger
    },
  }))
  return { tooltip: tooltip!, trigger: trigger as HTMLButtonElement | null, wrapper }
}

describe('useTooltip', () => {
  it('把 aria-describedby 挂到触发器上，卸载时还原', () => {
    const { tooltip, trigger, wrapper } = setupTooltip()

    expect(trigger!.getAttribute('aria-describedby')).toBe(tooltip.id)
    expect(tooltip.describedBy).toBe(tooltip.id)

    wrapper.unmount()
    expect(trigger!.hasAttribute('aria-describedby')).toBe(false)
  })

  it('保留触发器原有的 aria-describedby 并在解绑后还原', () => {
    let tooltip: UseTooltipReturn | undefined
    const wrapper = mount(defineComponent({
      setup() {
        tooltip = useTooltip()
        return () => h('div')
      },
    }))
    const trigger = document.createElement('button')
    trigger.setAttribute('aria-describedby', 'existing')
    document.body.append(trigger)

    tooltip!.triggerRef.value = trigger
    expect(trigger.getAttribute('aria-describedby')).toBe(`existing ${tooltip!.id}`)

    tooltip!.triggerRef.value = null
    expect(trigger.getAttribute('aria-describedby')).toBe('existing')
    wrapper.unmount()
  })

  it('悬停延迟后才显示，离开后走桥接延迟隐藏', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()
    const { tooltip, trigger } = setupTooltip({ delay: 200, onShow, onHide })

    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()

    trigger!.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(99)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('hideDelay 大于 0 时按它等待', async () => {
    const { tooltip, trigger } = setupTooltip({ delay: 0, hideDelay: 500 })

    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger!.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(499)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
  })

  it('isEnabled 为 false 时不显示', async () => {
    const enabled = ref(false)
    const { tooltip, trigger } = setupTooltip({ delay: 0, isEnabled: enabled })

    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)

    enabled.value = true
    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
  })

  it('受控时强制显示，Escape 只上报不自己关', async () => {
    const controlled = ref<boolean | undefined>(true)
    const onHide = vi.fn()
    const { tooltip, trigger } = setupTooltip({ isOpen: controlled, onHide })

    expect(tooltip.isOpen.value).toBe(true)

    trigger!.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    expect(onHide).toHaveBeenCalledOnce()

    controlled.value = false
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
  })

  it('未受控时 Escape 直接关闭', async () => {
    const onHide = vi.fn()
    const { tooltip, trigger } = setupTooltip({ delay: 0, onHide })

    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('鼠标按下立即关闭', async () => {
    const { tooltip, trigger } = setupTooltip({ delay: 0 })

    trigger!.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger!.dispatchEvent(new Event('pointerdown'))
    await nextTick()

    expect(tooltip.isOpen.value).toBe(false)
  })

  it('触摸轻点会切换显示，动作类触发器在 auto 下不打开', async () => {
    const { tooltip, trigger } = setupTooltip({ delay: 0 })
    const tap = (): Event => {
      const event = new Event('pointerdown', { bubbles: true })
      Object.defineProperty(event, 'pointerType', { value: 'touch' })
      return event
    }

    trigger!.dispatchEvent(tap())
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)

    trigger!.dispatchEvent(tap())
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
  })

  it('touchTrigger 为 tap 时动作类触发器也打开', async () => {
    const { tooltip, trigger } = setupTooltip({ delay: 0, touchTrigger: 'tap' })
    const event = new Event('pointerdown', { bubbles: true })
    Object.defineProperty(event, 'pointerType', { value: 'touch' })

    trigger!.dispatchEvent(event)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
  })

  it('isDefaultOpen 挂载即显示并上报', async () => {
    const onShow = vi.fn()
    const { tooltip } = setupTooltip({ isDefaultOpen: true, onShow })

    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()
  })

  it('focusTrigger 为 never 时不响应焦点', async () => {
    const { tooltip } = setupTooltip({ focusTrigger: 'never' })
    const trigger = document.createElement('button')
    document.body.append(trigger)
    tooltip.triggerRef.value = trigger

    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
  })

  it('内容元素上摊开的属性带 ID、role 和保持显示的事件', () => {
    const { tooltip } = setupTooltip()

    expect(tooltip.contentProps.value.id).toBe(tooltip.id)
    expect(tooltip.contentProps.value.role).toBe('tooltip')
    expect(typeof tooltip.contentProps.value.onMouseenter).toBe('function')
    expect(typeof tooltip.contentProps.value.onMouseleave).toBe('function')
  })
})

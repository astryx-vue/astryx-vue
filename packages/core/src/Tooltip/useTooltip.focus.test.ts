import type { UseTooltipOptions, UseTooltipReturn } from './useTooltip.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import { useTooltip } from './useTooltip.js'

beforeEach(() => {
  vi.useFakeTimers()
  resetInteractionModalityForTest()
  // jsdom 不实现 :focus-visible：键盘到达的焦点按命中算，由 data 标记模拟。
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
    return selector === ':focus-visible' ? this === document.activeElement : matches.call(this, selector)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function setup(options: UseTooltipOptions = {}) {
  let tooltip!: UseTooltipReturn
  const wrapper = mount(defineComponent({
    setup() {
      tooltip = useTooltip(options)
      return () => h('div')
    },
  }))
  return { tooltip, wrapper }
}

function attach(tooltip: UseTooltipReturn, html: string): HTMLElement {
  document.body.innerHTML = html
  const trigger = document.body.firstElementChild as HTMLElement
  tooltip.triggerRef.value = trigger
  return trigger
}

describe('useTooltip 焦点触发在焦点到达时判断', () => {
  it('auto：挂监听时 tabindex 为 -1 的漫游成员，轮到它时能打开', async () => {
    const { tooltip, wrapper } = setup({ delay: 0 })
    const trigger = attach(tooltip, '<div tabindex="-1">成员</div>')
    trigger.tabIndex = 0
    trigger.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    wrapper.unmount()
  })

  it('auto：普通包裹层不理会里面子元素的焦点', async () => {
    const { tooltip, wrapper } = setup({ delay: 0 })
    const trigger = attach(tooltip, '<span><button>里面</button></span>')
    trigger.querySelector('button')!.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
    wrapper.unmount()
  })

  it('auto：触发器可聚焦时，里面子元素的焦点也算', async () => {
    const { tooltip, wrapper } = setup({ delay: 0 })
    const trigger = attach(tooltip, '<div tabindex="0"><button>里面</button></div>')
    trigger.querySelector('button')!.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    wrapper.unmount()
  })

  it('到达时算数的焦点，失焦时收起，哪怕触发器之后离开了 Tab 顺序', async () => {
    const { tooltip, wrapper } = setup({ delay: 0, hideDelay: 50 })
    const trigger = attach(tooltip, '<div tabindex="0"><button>里面</button></div>')
    const inner = trigger.querySelector('button')!
    inner.focus()
    await nextTick()
    trigger.removeAttribute('tabindex')
    inner.blur()
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)
    wrapper.unmount()
  })

  it('指针按下之后脚本挪来的焦点：非文本触发器不打开，文本框照常打开', async () => {
    const { tooltip, wrapper } = setup({ delay: 0 })
    const button = attach(tooltip, '<button>按钮</button>')
    document.dispatchEvent(new Event('pointerdown'))
    button.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)

    const input = attach(tooltip, '<input type="text" />')
    input.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    wrapper.unmount()
  })

  it('键盘按下之后到达的焦点照常打开', async () => {
    const { tooltip, wrapper } = setup({ delay: 0 })
    const button = attach(tooltip, '<button>按钮</button>')
    document.dispatchEvent(new Event('pointerdown'))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    button.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    wrapper.unmount()
  })

  it('受控且保持关闭时，本该打开的焦点只上报 onShow，什么都不显示', async () => {
    const onShow = vi.fn()
    const { tooltip, wrapper } = setup({ delay: 0, isOpen: false, onShow })
    const button = attach(tooltip, '<button>按钮</button>')
    button.focus()
    await nextTick()
    expect(onShow).toHaveBeenCalledOnce()
    expect(tooltip.isOpen.value).toBe(false)
    wrapper.unmount()
  })

  it('禁用时收起已打开的提示，重新启用时焦点已在触发器里就再打开', async () => {
    const enabled = ref(true)
    const { tooltip, wrapper } = setup({ delay: 0, isEnabled: enabled })
    const button = attach(tooltip, '<button>按钮</button>')
    button.focus()
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)

    enabled.value = false
    await nextTick()
    expect(tooltip.isOpen.value).toBe(false)

    enabled.value = true
    await nextTick()
    expect(tooltip.isOpen.value).toBe(true)
    wrapper.unmount()
  })
})

import type { CollapsibleGroupContextValue } from './context.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, provide, ref } from 'vue'
import { collapsibleGroupKey } from './context.js'
import { useCollapsible } from './useCollapsible.js'

/** 在组件 setup 里跑 hook，拿到返回值和可写状态。 */
function setup(options: Parameters<typeof useCollapsible>[0] = {}) {
  let result: ReturnType<typeof useCollapsible> | undefined
  const wrapper = mount(defineComponent({
    setup() {
      result = useCollapsible(options)
      return () => h('div')
    },
  }))
  return { result: result!, wrapper }
}

describe('useCollapsible', () => {
  it('自己管状态，默认展开，切换时上报', async () => {
    const onOpenChange = vi.fn()
    const { result } = setup({ isCollapsible: { onOpenChange } })

    expect(result.isEnabled.value).toBe(true)
    expect(result.isOpen.value).toBe(true)

    result.toggle()
    expect(result.isOpen.value).toBe(false)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)

    result.toggle()
    expect(result.isOpen.value).toBe(true)
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it('用 defaultIsOpen 决定初始状态', () => {
    const { result } = setup({ isCollapsible: { defaultIsOpen: false } })

    expect(result.isOpen.value).toBe(false)
    result.toggle()
    expect(result.isOpen.value).toBe(true)
  })

  it('受控模式读 isOpen，并把它写成请求', () => {
    const isOpen = ref<boolean | undefined>(false)
    const onOpenChange = vi.fn()
    const { result } = setup({ isCollapsible: { isOpen, defaultIsOpen: true, onOpenChange } })

    expect(result.isOpen.value).toBe(false)

    result.toggle()
    expect(isOpen.value).toBe(true)
    expect(result.isOpen.value).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('受控时外部改动会立即反映到 isOpen', () => {
    const isOpen = ref<boolean | undefined>(false)
    const { result } = setup({ isCollapsible: { isOpen } })

    isOpen.value = true
    expect(result.isOpen.value).toBe(true)

    isOpen.value = undefined
    expect(result.isOpen.value).toBe(true)
  })

  it('isCollapsible 为 false 时恒为关闭且不能切换', () => {
    const { result } = setup({ isCollapsible: false })

    expect(result.isEnabled.value).toBe(false)
    expect(result.isOpen.value).toBe(false)
    result.toggle()
    expect(result.isOpen.value).toBe(false)
  })

  it('在组里时状态由组管理，点击交给组处理', () => {
    const open = ref(true)
    const group: CollapsibleGroupContextValue = {
      isOpen: vi.fn(value => value === 'a' && open.value),
      toggle: vi.fn((value: string) => {
        open.value = value === 'a' ? !open.value : open.value
      }),
    }
    const { result } = setup({ group, value: 'a' })

    expect(result.isOpen.value).toBe(true)
    result.toggle()
    expect(group.toggle).toHaveBeenCalledWith('a')
    expect(result.isOpen.value).toBe(false)
  })

  it('没有 value 时即使有组也自己管状态', () => {
    const group: CollapsibleGroupContextValue = { isOpen: vi.fn(() => true), toggle: vi.fn() }
    const { result } = setup({ group, isCollapsible: { defaultIsOpen: false } })

    expect(result.isOpen.value).toBe(false)
    result.toggle()
    expect(result.isOpen.value).toBe(true)
    expect(group.toggle).not.toHaveBeenCalled()
  })

  it('从上层注入的组继承状态', () => {
    const isOpen = ref(false)
    const group: CollapsibleGroupContextValue = {
      isOpen: value => value === 'item' && isOpen.value,
      toggle: vi.fn(() => {
        isOpen.value = true
      }),
    }

    let result: ReturnType<typeof useCollapsible> | undefined
    const Child = defineComponent({
      setup() {
        result = useCollapsible({ value: 'item' })
        return () => h('div')
      },
    })
    mount(defineComponent({
      setup() {
        provide(collapsibleGroupKey, group)
        return () => h(Child)
      },
    }))

    expect(result!.isOpen.value).toBe(false)
    result!.toggle()
    expect(group.toggle).toHaveBeenCalledWith('item')
    expect(result!.isOpen.value).toBe(true)
  })

  it('value 跟着响应式变化切换组键', () => {
    const open = ref<string[]>(['a'])
    const group: CollapsibleGroupContextValue = {
      isOpen: value => computed(() => open.value).value.includes(value),
      toggle: (value) => {
        open.value = open.value.includes(value) ? [] : [value]
      },
    }
    const value = ref('a')
    const { result } = setup({ group, value })

    expect(result.isOpen.value).toBe(true)
    value.value = 'b'
    expect(result.isOpen.value).toBe(false)
  })
})

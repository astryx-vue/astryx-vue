import type { MergedRef, MergedRefHandle } from './useMergedRefs.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useMergedRefs } from './useMergedRefs.js'

function mountHost(targets: readonly MergedRef<HTMLElement>[]) {
  return mount(defineComponent({
    name: 'MergedRefsHost',
    setup() {
      const merged = useMergedRefs<HTMLElement>(targets)
      return () => h('div', { ref: merged, class: 'target' })
    },
  }))
}

describe('useMergedRefs', () => {
  it('把元素同时写进每个 Ref', async () => {
    const first = ref<HTMLElement | null>(null)
    const second = ref<HTMLElement | null>(null)
    const wrapper = mountHost([first, second])
    await nextTick()

    expect(first.value).toBeInstanceOf(HTMLElement)
    expect(second.value).toBe(first.value)
    expect(wrapper.find('.target').element).toBe(first.value)
  })

  it('函数 ref 也会收到元素', async () => {
    const seen = vi.fn()
    const wrapper = mountHost([seen])
    await nextTick()

    expect(seen).toHaveBeenCalledWith(wrapper.find('.target').element)
  })

  it('空着的目标直接跳过', async () => {
    const first = ref<HTMLElement | null>(null)
    const wrapper = mountHost([null, first, undefined])
    await nextTick()

    expect(first.value).toBe(wrapper.find('.target').element)
  })

  it('卸载时把每个目标都清成 null', async () => {
    const first = ref<HTMLElement | null>(null)
    const seen = vi.fn()
    const wrapper = mountHost([first, seen])
    await nextTick()
    wrapper.unmount()

    expect(first.value).toBeNull()
    expect(seen).toHaveBeenLastCalledWith(null)
  })

  it('重复渲染后仍然是同一个函数', async () => {
    const first = ref<HTMLElement | null>(null)
    let merged: MergedRefHandle | undefined
    const wrapper = mount(defineComponent({
      name: 'MergedRefsStableHost',
      setup() {
        merged = useMergedRefs<HTMLElement>([first])
        const count = ref(0)
        return () => h('div', {
          ref: merged,
          onClick: () => {
            count.value += 1
          },
        })
      },
    }))
    await nextTick()
    const captured = merged

    await wrapper.trigger('click')
    expect(merged).toBe(captured)
    expect(first.value).toBe(wrapper.element)
  })
})

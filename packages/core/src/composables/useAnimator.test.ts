/**
 * @file useAnimator.test.ts
 * @input vitest (happy-dom), @vue/test-utils, the public composable
 * @output `useAnimator(target)` returns one animator, the factory's handle
 *   without `destroy`. Used before its element mounts it does nothing and
 *   resolves at once. It follows the element behind the template ref when the
 *   node is replaced, and the new node starts at rest. An unmount drops the
 *   values, and a remount starts at rest. Animating causes no re-render.
 * @position Testing; validates useAnimator.ts
 */

import type { AnimatorHandle } from './createAnimator.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { useAnimator } from './useAnimator.js'

beforeEach(() => {
  HTMLElement.prototype.animate = function () {
    return {
      startTime: null,
      playState: 'running',
      ready: new Promise(() => {}),
      cancel: vi.fn(),
    } as unknown as Animation
  }
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
})

interface Probe {
  animator: AnimatorHandle | null
  renders: number
}

function probe(show: { value: boolean }, key?: { value: string }): { box: Probe, component: ReturnType<typeof defineComponent> } {
  const box: Probe = { animator: null, renders: 0 }
  const component = defineComponent({
    setup() {
      const target = useTemplateRef<HTMLElement>('target')
      box.animator = useAnimator(target)
      return () => {
        box.renders += 1
        return show.value ? h('div', { 'ref': 'target', 'key': key?.value, 'data-testid': 'target' }) : null
      }
    },
  })
  return { box, component }
}

describe('useAnimator', () => {
  it('returns the handle’s six methods, and nothing else: no destroy of its own', () => {
    const { box, component } = probe(ref(true))
    const wrapper = mount(component)
    expect(Object.keys(box.animator!).sort()).toEqual(['animate', 'decay', 'get', 'getVelocity', 'set', 'stop'])
    wrapper.unmount()
  })

  it('never re-renders while animating', async () => {
    const { box, component } = probe(ref(true))
    const wrapper = mount(component)
    const before = box.renders
    void box.animator!.animate({ x: 20 })
    box.animator!.set({ y: 4 })
    await nextTick()
    expect(box.renders).toBe(before)
    wrapper.unmount()
  })

  it('an animator used before its element mounts does nothing and resolves at once', async () => {
    const show = ref(false)
    const { box, component } = probe(show)
    const wrapper = mount(component)
    const animator = box.animator!
    animator.set({ x: 30, opacity: 0.4 })
    animator.stop()
    expect(animator.get()).toMatchObject({ x: 0, opacity: 1 })
    await expect(Promise.all([animator.animate({ y: 10 }), animator.decay({ x: 900 })])).resolves.toEqual([undefined, undefined])
    show.value = true
    await nextTick()
    const target = wrapper.get('[data-testid="target"]').element as HTMLElement
    animator.set({ x: 30 })
    expect(target.style.translate).toBe('30px 0px')
    wrapper.unmount()
  })

  it('an unmount of the element lets it go and drops the values; a remount starts at rest', async () => {
    const show = ref(true)
    const { box, component } = probe(show)
    const wrapper = mount(component)
    const animator = box.animator!
    animator.set({ x: 12, rotate: 5 })
    show.value = false
    await nextTick()
    animator.set({ x: 24 })
    expect(animator.get()).toMatchObject({ x: 0, rotate: 0 })
    show.value = true
    await nextTick()
    const target = wrapper.get('[data-testid="target"]').element as HTMLElement
    expect(['', 'none', '0px 0px']).toContain(target.style.translate)
    expect(['', 'none', '0deg']).toContain(target.style.rotate)
    wrapper.unmount()
  })

  it('follows the element behind the ref when the node is replaced, and the new node starts at rest', async () => {
    const key = ref('first')
    const { box, component } = probe(ref(true), key)
    const wrapper = mount(component)
    const animator = box.animator!
    animator.set({ x: 8 })
    const first = wrapper.get('[data-testid="target"]').element as HTMLElement
    expect(first.style.translate).toBe('8px 0px')
    key.value = 'second'
    await nextTick()
    const second = wrapper.get('[data-testid="target"]').element as HTMLElement
    expect(second).not.toBe(first)
    expect(['', 'none', '0px 0px']).toContain(second.style.translate)
    animator.set({ x: 16 })
    expect(second.style.translate).toBe('16px 0px')
    wrapper.unmount()
  })

  it('has the element by the time onMounted runs', () => {
    let seen = ''
    const component = defineComponent({
      setup() {
        const target = useTemplateRef<HTMLElement>('target')
        const animator = useAnimator(target)
        onMounted(() => {
          animator.set({ x: 3 })
          seen = target.value?.style.translate ?? ''
        })
        return () => h('div', { ref: 'target' })
      },
    })
    mount(component).unmount()
    expect(seen).toBe('3px 0px')
  })

  it('takes a plain element or a getter too, and lets go when its scope ends', () => {
    const element = document.createElement('div')
    const box: Probe = { animator: null, renders: 0 }
    const getter = defineComponent({
      setup() {
        box.animator = useAnimator(() => element)
        return () => null
      },
    })
    const wrapper = mount(getter)
    box.animator!.set({ x: 5 })
    expect(element.style.translate).toBe('5px 0px')
    wrapper.unmount()
    box.animator!.set({ x: 9 })
    expect(box.animator!.get().x).toBe(0)
  })
})

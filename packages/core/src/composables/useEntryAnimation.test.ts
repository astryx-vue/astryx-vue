import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetEntryAnimationForTest } from './testing/resetEntryAnimation.js'
import { useEntryAnimation } from './useEntryAnimation.js'

async function waitForFirstPaint(): Promise<void> {
  await vi.waitFor(() => {
    expect(useEntryAnimation().entryClass).not.toBeNull()
  })
}

describe('useEntryAnimation', () => {
  beforeEach(() => {
    resetEntryAnimationForTest()
  })

  it('首屏渲染的元素不播放动画', () => {
    expect(useEntryAnimation().entryClass).toBeNull()
    expect(useEntryAnimation({ preset: 'fadeIn' }).entryClass).toBeNull()
  })

  it('首屏画完之后插入的元素才拿到动画类', async () => {
    const before = useEntryAnimation()
    expect(before.entryClass).toBeNull()

    await waitForFirstPaint()
    expect(useEntryAnimation().entryClass).toBe('astryx-motion-slide-in-below')
  })

  it('默认预设是 slideDown', async () => {
    await waitForFirstPaint()
    expect(useEntryAnimation().entryClass).toBe('astryx-motion-slide-in-below')
    expect(useEntryAnimation({}).entryClass).toBe('astryx-motion-slide-in-below')
  })

  it.each([
    ['slideDown', 'astryx-motion-slide-in-below'],
    ['slideUp', 'astryx-motion-slide-in-above'],
    ['fadeIn', 'astryx-motion-fade-in'],
    ['scaleIn', 'astryx-motion-scale-in'],
  ] as const)('预设 %s 对应 %s', async (preset, className) => {
    await waitForFirstPaint()
    expect(useEntryAnimation({ preset }).entryClass).toBe(className)
  })

  it('动画类绑到元素上就真的挂上去了', async () => {
    await waitForFirstPaint()
    const wrapper = mount(defineComponent({
      name: 'EntryAnimationHost',
      setup() {
        const { entryClass } = useEntryAnimation({ preset: 'fadeIn' })
        return () => h('div', { class: entryClass })
      },
    }))
    await nextTick()

    expect(wrapper.classes()).toContain('astryx-motion-fade-in')
  })

  it('先挂的元素重新渲染后也不会补上动画类', async () => {
    const count = ref(0)
    const wrapper = mount(defineComponent({
      name: 'EntryAnimationLateHost',
      setup() {
        const { entryClass } = useEntryAnimation()
        return () => h('div', { 'class': entryClass, 'data-count': count.value })
      },
    }))
    expect(wrapper.classes()).not.toContain('astryx-motion-slide-in-below')

    await waitForFirstPaint()
    count.value += 1
    await nextTick()
    expect(wrapper.classes()).not.toContain('astryx-motion-slide-in-below')
  })
})

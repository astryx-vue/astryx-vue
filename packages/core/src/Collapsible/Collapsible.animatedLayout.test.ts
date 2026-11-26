import type { AnimatedLayout } from '../composables/useAnimatedLayout.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import * as layout from '../motion/layout/index.js'
import Collapsible from './Collapsible.vue'

vi.mock('../motion/layout/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../motion/layout/index.js')>()
  return {
    ...actual,
    applyLayoutChangeTransition: vi.fn(),
    holdLayoutExit: vi.fn(() => false),
    playLayoutChange: vi.fn(() => null),
    releaseLayoutExit: vi.fn(),
    reportLayoutChange: vi.fn(() => ({ measureBefore: vi.fn(), animate: vi.fn(() => true) })),
  }
})

const handle = layout.createAnimatedLayout(() => null)

function mountWith(animatedLayout?: AnimatedLayout) {
  return mount(Collapsible, {
    props: { trigger: 'Details', animatedLayout },
    slots: { default: '<p class="body">Body</p>' },
    attachTo: document.body,
  })
}

function contentOf(wrapper: ReturnType<typeof mountWith>): HTMLElement {
  return wrapper.find('.astryx-collapsible-content').element as HTMLElement
}

afterEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('collapsible with an animatedLayout handle', () => {
  it('measures before the change lands and turns the chevron on the glide', async () => {
    const wrapper = mountWith(handle)
    await wrapper.find('button').trigger('click')
    await nextTick()

    const change = vi.mocked(layout.reportLayoutChange).mock.results[0]!.value as layout.LayoutChange
    expect(layout.reportLayoutChange).toHaveBeenCalledWith(handle, expect.any(Function))
    expect(change.measureBefore).toHaveBeenCalledTimes(1)
    expect(change.animate).toHaveBeenCalledTimes(1)
    const chevron = vi.mocked(layout.applyLayoutChangeTransition).mock.calls.find(([value]) => value === handle)
    expect(chevron?.[1]).toBe(wrapper.find('.astryx-collapsible-chevron').element)
    wrapper.unmount()
  })

  it('keeps the content rendered while its exit plays, then hides it', async () => {
    let endExit: (() => void) | undefined
    vi.mocked(layout.holdLayoutExit).mockImplementationOnce((_handle, _element, done) => {
      endExit = done
      return true
    })
    const wrapper = mountWith(handle)
    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
    expect(layout.holdLayoutExit).toHaveBeenCalledWith(handle, contentOf(wrapper), expect.any(Function))
    expect(contentOf(wrapper).style.display).not.toBe('none')

    endExit?.()
    await nextTick()
    expect(contentOf(wrapper).style.display).toBe('none')
    expect(layout.releaseLayoutExit).toHaveBeenCalledWith(contentOf(wrapper))
    wrapper.unmount()
  })

  it('hides the content at once when the exit is not held', async () => {
    const wrapper = mountWith(handle)
    await wrapper.find('button').trigger('click')
    await nextTick()
    await nextTick()

    expect(contentOf(wrapper).style.display).toBe('none')
    wrapper.unmount()
  })

  it('plays the entrance when it opens again', async () => {
    const wrapper = mountWith(handle)
    await wrapper.find('button').trigger('click')
    await nextTick()
    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(layout.releaseLayoutExit).toHaveBeenCalledWith(contentOf(wrapper))
    expect(layout.playLayoutChange).toHaveBeenCalledWith(handle, contentOf(wrapper))
    expect(contentOf(wrapper).style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('measures a change made by the bound open state too', async () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', isOpen: true, animatedLayout: handle },
      attachTo: document.body,
    })
    await wrapper.setProps({ isOpen: false })
    await nextTick()

    expect(layout.reportLayoutChange).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})

describe('collapsible without a handle', () => {
  it('measures nothing and clears the chevron to its own transition', async () => {
    const wrapper = mountWith()
    expect(layout.applyLayoutChangeTransition).toHaveBeenCalledWith(null, wrapper.find('.astryx-collapsible-chevron').element)

    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(layout.reportLayoutChange).not.toHaveBeenCalled()
    expect(layout.holdLayoutExit).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

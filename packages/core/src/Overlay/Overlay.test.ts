import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { UseOverlayOptions } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Overlay from './Overlay.vue'
import OverlayScrim from './OverlayScrim.vue'
import { useOverlay } from './useOverlay.js'

const OVERLAY_SLOTS = {
  default: '<div class="base">base</div>',
  content: '<button type="button" class="action">Quick view</button>',
}

/** 遮罩带着 data-position，用它定位遮罩而不依赖内部类名之外的结构。 */
function getScrim(wrapper: VueWrapper): DOMWrapper<Element> {
  return wrapper.find('[data-position]')
}

/**
 * 让 `matchMedia('(hover: none)')` 报告指定值，以便分别验证指针设备与触屏分支。
 */
function mockHoverNone(matches: boolean) {
  const listeners = new Set<() => void>()
  const query = {
    matches,
    media: '(hover: none)',
    onchange: null,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }
  const original = window.matchMedia
  window.matchMedia = (() => query) as unknown as typeof window.matchMedia
  return {
    emitChange: (next: boolean) => {
      query.matches = next
      for (const listener of listeners)
        listener()
    },
    listenerCount: () => listeners.size,
    restore: () => {
      window.matchMedia = original
    },
  }
}

let restoreMatchMedia: (() => void) | undefined

afterEach(() => {
  restoreMatchMedia?.()
  restoreMatchMedia = undefined
})

describe('overlay', () => {
  describe('structure', () => {
    it('renders the base content and the overlay content inside the scrim', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })

      expect(wrapper.find('.base').exists()).toBe(true)
      expect(wrapper.find('.action').text()).toBe('Quick view')
      expect(getScrim(wrapper).find('.action').exists()).toBe(true)
    })

    it('renders a root div carrying the overlay class', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })

      expect(wrapper.element.tagName).toBe('DIV')
      expect((wrapper.element as HTMLElement).classList.contains('astryx-overlay')).toBe(true)
    })

    it('places the scrim after the base content', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })
      const base = wrapper.find('.base').element
      const scrim = getScrim(wrapper).element

      expect(base.compareDocumentPosition(scrim) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect((wrapper.element as HTMLElement).contains(scrim)).toBe(true)
      expect(scrim.classList.contains('astryx-overlay-scrim')).toBe(true)
    })

    it('mirrors the border radius of the first child onto the root', async () => {
      const computed = window.getComputedStyle
      window.getComputedStyle = ((element: Element) => ({
        borderRadius: (element as HTMLElement).style.borderRadius || '0px',
      })) as typeof window.getComputedStyle
      try {
        const wrapper = mount(Overlay, {
          slots: {
            default: '<div class="base" style="border-radius: 12px">base</div>',
            content: '<span>overlay</span>',
          },
        })

        await nextTick()
        expect((wrapper.element as HTMLElement).style.borderRadius).toBe('12px')

        const square = mount(Overlay, {
          slots: {
            default: '<div class="base">base</div>',
            content: '<span>overlay</span>',
          },
        })

        await nextTick()
        expect((square.element as HTMLElement).style.borderRadius).toBe('')
      }
      finally {
        window.getComputedStyle = computed
      }
    })

    it('exposes the root element', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })
      const exposed = wrapper.vm as unknown as { element: HTMLElement }

      expect(exposed.element).toBe(wrapper.element)
    })

    it('renders no scrim when the content slot is absent', () => {
      const wrapper = mount(Overlay, { slots: { default: '<div class="base">base</div>' } })

      expect(wrapper.find('.base').exists()).toBe(true)
      expect(wrapper.find('.astryx-overlay-scrim').exists()).toBe(false)
    })

    it('renders the scrim once the content slot appears', async () => {
      const hasContent = ref(false)
      const host = mount(defineComponent({
        setup() {
          return () => h(Overlay, null, {
            default: () => h('div', { class: 'base' }),
            ...(hasContent.value ? { content: () => h('span', { class: 'action' }, 'overlay') } : {}),
          })
        },
      }))

      expect(host.find('.astryx-overlay-scrim').exists()).toBe(false)
      hasContent.value = true
      await nextTick()
      expect(host.find('.astryx-overlay-scrim').exists()).toBe(true)
      expect(host.find('.action').exists()).toBe(true)
    })

    it('passes native attributes through to the root', () => {
      const wrapper = mount(Overlay, {
        attrs: { 'class': 'custom', 'style': 'opacity: 0.5', 'data-testid': 'ovl' },
        slots: OVERLAY_SLOTS,
      })
      const root = wrapper.element as HTMLElement

      expect(root.classList.contains('custom')).toBe(true)
      expect(root.classList.contains('astryx-overlay')).toBe(true)
      expect(root.style.opacity).toBe('0.5')
      expect(root.getAttribute('data-testid')).toBe('ovl')
      expect(root.getAttribute('data-pressable-container')).toBe('true')
    })
  })

  describe('position and align', () => {
    it('defaults to a filling, trailing-aligned scrim', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-position')).toBe('fill')
      expect(getScrim(wrapper).attributes('data-align')).toBe('end')
    })

    it.each(['fill', 'bottom', 'top'] as const)('reflects position="%s"', (position) => {
      const wrapper = mount(Overlay, { props: { position }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-position')).toBe(position)
    })

    it.each(['start', 'center', 'end'] as const)('reflects align="%s"', (align) => {
      const wrapper = mount(Overlay, { props: { align }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-align')).toBe(align)
    })
  })

  describe('scrim surface', () => {
    it('switches the content to the dark surface by default', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-scrim')).toBe('dark')
      expect(wrapper.find('[data-astryx-media="dark"]').exists()).toBe(true)
    })

    it('switches the content to the light surface for scrim="light"', () => {
      const wrapper = mount(Overlay, { props: { scrim: 'light' }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-scrim')).toBe('light')
      expect(wrapper.find('[data-astryx-media="light"]').exists()).toBe(true)
      expect(wrapper.find('[data-astryx-media="dark"]').exists()).toBe(false)
    })

    it('renders no surface at all for scrim=false', () => {
      const wrapper = mount(Overlay, { props: { scrim: false }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-scrim')).toBe('none')
      expect(wrapper.find('[data-astryx-media]').exists()).toBe(false)
      expect(getScrim(wrapper).find('.action').exists()).toBe(true)
    })
  })

  describe('showOn', () => {
    it('is always visible by default', () => {
      const wrapper = mount(Overlay, { slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-visibility')).toBe('visible')
      expect(getScrim(wrapper).element.hasAttribute('inert')).toBe(false)
    })

    it.each([
      ['hover', 'hover'],
      ['hover-or-focus', 'hover'],
      ['focus', 'focus'],
      ['always', 'visible'],
    ] as const)('maps showOn="%s" to the %s reveal state', (showOn, expected) => {
      const wrapper = mount(Overlay, { props: { showOn }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-visibility')).toBe(expected)
    })

    it('is never inert in uncontrolled mode', () => {
      const wrapper = mount(Overlay, { props: { showOn: 'hover' }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).element.hasAttribute('inert')).toBe(false)
    })
  })

  describe('isOpen', () => {
    it('hides and inerts the scrim while closed', () => {
      const wrapper = mount(Overlay, { props: { isOpen: false }, slots: OVERLAY_SLOTS })
      const scrim = getScrim(wrapper).element

      expect(scrim.getAttribute('data-visibility')).toBe('hidden')
      expect(scrim.hasAttribute('inert')).toBe(true)
    })

    it('shows the scrim while open', () => {
      const wrapper = mount(Overlay, { props: { isOpen: true }, slots: OVERLAY_SLOTS })
      const scrim = getScrim(wrapper).element

      expect(scrim.getAttribute('data-visibility')).toBe('visible')
      expect(scrim.hasAttribute('inert')).toBe(false)
    })

    it('follows the bound state as it changes', async () => {
      const wrapper = mount(Overlay, { props: { isOpen: false }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).element.hasAttribute('inert')).toBe(true)
      await wrapper.setProps({ isOpen: true })
      expect(getScrim(wrapper).element.hasAttribute('inert')).toBe(false)
      expect(getScrim(wrapper).attributes('data-visibility')).toBe('visible')
    })

    it('updates through v-model:isOpen', async () => {
      const isOpen = ref(false)
      const host = mount(defineComponent({
        setup() {
          return () => h(Overlay, { 'isOpen': isOpen.value, 'onUpdate:isOpen': undefined }, {
            default: () => h('div', { class: 'base' }),
            content: () => h('span', { class: 'action' }, 'overlay'),
          })
        },
      }))

      expect(getScrim(host).attributes('data-visibility')).toBe('hidden')
      isOpen.value = true
      await nextTick()
      expect(getScrim(host).attributes('data-visibility')).toBe('visible')
      expect(getScrim(host).element.hasAttribute('inert')).toBe(false)
    })

    it('takes precedence over showOn', async () => {
      const wrapper = mount(Overlay, { props: { showOn: 'hover', isOpen: true }, slots: OVERLAY_SLOTS })

      expect(getScrim(wrapper).attributes('data-visibility')).toBe('visible')
      await wrapper.setProps({ isOpen: false })
      expect(getScrim(wrapper).attributes('data-visibility')).toBe('hidden')
    })
  })
})

function mountHost(options: () => UseOverlayOptions) {
  return mount(defineComponent({
    setup() {
      const overlay = useOverlay(options())
      return () => h(
        'div',
        { ...overlay.containerProps.value, ref: overlay.containerRef },
        [
          h('div', { class: 'base' }),
          h('button', { class: 'nested', type: 'button' }, 'nested'),
          h(OverlayScrim, { ...overlay.scrimProps.value }, {
            default: () => h('span', { class: 'action' }, 'overlay'),
          }),
        ],
      )
    },
  }))
}

function scrimOf(wrapper: VueWrapper): DOMWrapper<Element> {
  return wrapper.find('[data-position]')
}

describe('useOverlay', () => {
  it('returns a container ref, container attributes and scrim props', async () => {
    let overlay: ReturnType<typeof useOverlay> | undefined
    const host = mount(defineComponent({
      setup() {
        overlay = useOverlay({ showOn: 'hover' })
        return () => h('div', { ...overlay!.containerProps.value, ref: overlay!.containerRef }, [
          h(OverlayScrim, { ...overlay!.scrimProps.value }, { default: () => h('span', 'overlay') }),
        ])
      },
    }))
    await nextTick()

    expect(overlay!.containerRef.value).toBe(host.element)
    expect(host.find('.astryx-overlay-scope').attributes('data-pressable-container')).toBe('true')
    expect(scrimOf(host).attributes('data-visibility')).toBe('hover')
  })

  describe('pointer device', () => {
    it('leaves a hover reveal to CSS', async () => {
      const wrapper = mountHost(() => ({ showOn: 'hover' }))

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hover')
    })

    it('leaves a focus reveal to CSS', async () => {
      const wrapper = mountHost(() => ({ showOn: 'focus' }))

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('focus')
    })
  })

  describe('touch device', () => {
    it('toggles the overlay on a tap in hover mode', async () => {
      const media = mockHoverNone(true)
      restoreMatchMedia = media.restore

      const wrapper = mountHost(() => ({ showOn: 'hover' }))
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hidden')

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hidden')
    })

    it('ignores a tap that lands on a nested interactive element', async () => {
      const media = mockHoverNone(true)
      restoreMatchMedia = media.restore

      const wrapper = mountHost(() => ({ showOn: 'hover' }))

      await wrapper.find('.nested').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hidden')

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')
    })

    it('keeps a tap from changing showOn states that need no toggle', async () => {
      const media = mockHoverNone(true)
      restoreMatchMedia = media.restore

      const always = mountHost(() => ({ showOn: 'always' }))
      await always.find('.base').trigger('click')
      expect(scrimOf(always).attributes('data-visibility')).toBe('visible')

      const focus = mountHost(() => ({ showOn: 'focus' }))
      await focus.find('.base').trigger('click')
      expect(scrimOf(focus).attributes('data-visibility')).toBe('focus')
    })

    it('lets a bound isOpen override the tap toggle', async () => {
      const media = mockHoverNone(true)
      restoreMatchMedia = media.restore

      const wrapper = mountHost(() => ({ showOn: 'hover', isOpen: false }))
      await wrapper.find('.base').trigger('click')

      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hidden')
      expect(scrimOf(wrapper).element.hasAttribute('inert')).toBe(true)
    })

    it('stops listening for hover changes when the scope is disposed', () => {
      const media = mockHoverNone(false)
      restoreMatchMedia = media.restore

      const wrapper = mountHost(() => ({ showOn: 'hover' }))
      expect(media.listenerCount()).toBe(1)

      wrapper.unmount()
      expect(media.listenerCount()).toBe(0)
    })

    it('runs a consumer click handler alongside the tap toggle', async () => {
      const media = mockHoverNone(true)
      restoreMatchMedia = media.restore
      const onClick = vi.fn()

      const wrapper = mount(Overlay, {
        attrs: { onClick },
        props: { showOn: 'hover' },
        slots: OVERLAY_SLOTS,
      })

      await wrapper.find('.base').trigger('click')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(getScrim(wrapper).attributes('data-visibility')).toBe('visible')
    })
  })

  describe('reactivity', () => {
    it('starts toggling by tap when the device stops hovering', async () => {
      const media = mockHoverNone(false)
      restoreMatchMedia = media.restore

      const wrapper = mountHost(() => ({ showOn: 'hover' }))
      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hover')

      media.emitChange(true)
      await nextTick()

      await wrapper.find('.base').trigger('click')
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')
    })

    it('follows a reactive showOn instead of the value present at setup', async () => {
      const showOn = ref<UseOverlayOptions['showOn']>('hover')
      const wrapper = mountHost(() => ({ showOn }))

      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hover')
      expect(scrimOf(wrapper).attributes('data-align')).toBe('end')

      showOn.value = 'always'
      await nextTick()
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')
    })

    it('follows a reactive isOpen instead of the value present at setup', async () => {
      const isOpen = ref<boolean | undefined>(undefined)
      const wrapper = mountHost(() => ({ isOpen }))

      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')

      isOpen.value = false
      await nextTick()
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('hidden')

      isOpen.value = undefined
      await nextTick()
      expect(scrimOf(wrapper).attributes('data-visibility')).toBe('visible')
    })

    it('follows reactive scrim, position and align options', async () => {
      const scrim = ref<UseOverlayOptions['scrim']>('dark')
      const position = ref<UseOverlayOptions['position']>('fill')
      const align = ref<UseOverlayOptions['align']>('end')
      const wrapper = mountHost(() => ({ scrim, position, align }))

      expect(scrimOf(wrapper).attributes('data-scrim')).toBe('dark')
      expect(scrimOf(wrapper).attributes('data-position')).toBe('fill')

      scrim.value = 'light'
      position.value = 'bottom'
      align.value = 'start'
      await nextTick()

      expect(scrimOf(wrapper).attributes('data-scrim')).toBe('light')
      expect(scrimOf(wrapper).attributes('data-position')).toBe('bottom')
      expect(scrimOf(wrapper).attributes('data-align')).toBe('start')
    })
  })
})

describe('overlayScrim', () => {
  it('renders the content inside a scrim without a container', () => {
    const wrapper = mount(OverlayScrim, { slots: { default: '<span class="action">overlay</span>' } })

    expect(wrapper.classes()).toContain('astryx-overlay-scrim')
    expect(wrapper.find('.action').exists()).toBe(true)
    expect(wrapper.attributes('data-position')).toBe('fill')
  })

  it('keeps the CSS-driven reveal while isOpen stays unbound', async () => {
    const wrapper = mount(OverlayScrim, { props: { showOn: 'hover' } })

    expect(wrapper.attributes('data-visibility')).toBe('hover')
    await wrapper.setProps({ isOpen: undefined })
    expect(wrapper.attributes('data-visibility')).toBe('hover')
  })
})

describe('overlay integration', () => {
  it('reveals a bottom strip on a tap and hides it again', async () => {
    const media = mockHoverNone(true)
    restoreMatchMedia = media.restore

    const wrapper = mount(defineComponent({
      setup() {
        return () => h(Overlay, { showOn: 'hover', position: 'bottom', align: 'start' }, {
          default: () => h('div', { class: 'media' }),
          content: () => h('button', { class: 'action', type: 'button' }, 'Quick view'),
        })
      },
    }))

    expect(getScrim(wrapper).attributes('data-position')).toBe('bottom')
    expect(getScrim(wrapper).attributes('data-align')).toBe('start')
    expect(getScrim(wrapper).attributes('data-visibility')).toBe('hidden')

    await wrapper.find('.media').trigger('click')
    expect(getScrim(wrapper).attributes('data-visibility')).toBe('visible')
  })

  it('does not throw when the environment has no matchMedia', () => {
    const original = window.matchMedia
    // @ts-expect-error -- 模拟没有 matchMedia 的环境
    window.matchMedia = undefined
    try {
      expect(() => mountHost(() => ({ showOn: 'hover' }))).not.toThrow()
    }
    finally {
      window.matchMedia = original
    }
  })
})

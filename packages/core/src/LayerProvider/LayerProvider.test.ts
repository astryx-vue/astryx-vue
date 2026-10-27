import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { resolveLayerGutter } from '../layer/gutter.js'
import { computeLayerPosition } from '../layer/position.js'
import { toastStore } from '../Toast/store.js'
import ToastViewport from '../Toast/ToastViewport.vue'
import { useToast } from '../Toast/useToast.js'
import { useLayerConfig, useLayerGutter } from './context.js'
import LayerProvider from './LayerProvider.vue'

const Probe = defineComponent({
  name: 'Probe',
  setup() {
    const config = useLayerConfig()
    const gutter = useLayerGutter()
    return () => h('div', {
      'data-position': config?.value.toast.position ?? 'none',
      'data-max-visible': String(config?.value.toast.maxVisible ?? 'none'),
      'data-toast-inset': JSON.stringify(config?.value.toast.inset ?? {}),
      'data-gutter': JSON.stringify(gutter.value),
    })
  },
})

function probeAttributes(wrapper: ReturnType<typeof mount>) {
  const element = wrapper.get('[data-gutter]')
  return {
    position: element.attributes('data-position'),
    maxVisible: element.attributes('data-max-visible'),
    toastInset: element.attributes('data-toast-inset'),
    gutter: JSON.parse(element.attributes('data-gutter') ?? '{}'),
  }
}

function purgeToasts() {
  for (const toast of [...toastStore.toasts])
    toastStore.finalize(toast.id)
}

describe('resolveLayerGutter', () => {
  it('keeps the spacing-4 gutter when no inset is given', () => {
    expect(resolveLayerGutter()).toEqual({
      blockStart: 16,
      blockEnd: 16,
      inlineStart: 16,
      inlineEnd: 16,
    })
  })

  it('adds the inset to each edge', () => {
    expect(resolveLayerGutter({ blockEnd: 40, inlineStart: 4 })).toEqual({
      blockStart: 16,
      blockEnd: 56,
      inlineStart: 20,
      inlineEnd: 16,
    })
  })
})

describe('computeLayerPosition gutters', () => {
  const viewport = { width: 1024, height: 768 }
  const layer = { width: 120, height: 28 }

  function rect(top: number, left: number, width = 100, height = 32): DOMRect {
    return {
      top,
      left,
      width,
      height,
      bottom: top + height,
      right: left + width,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect
  }

  it('clamps with the default gutter', () => {
    const position = computeLayerPosition(rect(2, 2), layer, viewport, 'below', 'start', 4)

    expect(position.top).toBeGreaterThanOrEqual(16)
    expect(position.left).toBeGreaterThanOrEqual(16)
  })

  it('clamps with the gutter it is given', () => {
    const gutter = resolveLayerGutter({ blockStart: 100, inlineStart: 200 })
    const position = computeLayerPosition(rect(2, 2), layer, viewport, 'below', 'start', 4, gutter)

    expect(position.top).toBeGreaterThanOrEqual(116)
    expect(position.left).toBeGreaterThanOrEqual(216)
  })

  it('clamps the trailing edges with the gutter', () => {
    const gutter = resolveLayerGutter({ blockEnd: 100 })
    const position = computeLayerPosition(
      rect(viewport.height - 20, viewport.width - 20),
      layer,
      viewport,
      'above',
      'end',
      4,
      gutter,
    )

    expect(position.top).toBeLessThanOrEqual(viewport.height - layer.height - 116)
  })
})

describe('layerProvider', () => {
  afterEach(() => {
    purgeToasts()
  })

  it('reports an empty inset outside a provider', () => {
    const wrapper = mount(Probe)

    const attributes = probeAttributes(wrapper)
    expect(attributes.position).toBe('none')
    expect(attributes.maxVisible).toBe('none')
    expect(attributes.toastInset).toBe('{}')
    expect(attributes.gutter).toEqual({ blockStart: 16, blockEnd: 16, inlineStart: 16, inlineEnd: 16 })
  })

  it('passes the toast configuration down', () => {
    const wrapper = mount(LayerProvider, {
      props: { toast: { position: 'top-end', maxVisible: 2 } },
      slots: { default: () => h(Probe) },
    })

    const attributes = probeAttributes(wrapper)
    expect(attributes.position).toBe('top-end')
    expect(attributes.maxVisible).toBe('2')
  })

  it('adds the provider inset to every anchored layer gutter', () => {
    const wrapper = mount(LayerProvider, {
      props: { inset: { blockStart: 8, inlineEnd: '4px' } },
      slots: { default: () => h(Probe) },
    })

    expect(probeAttributes(wrapper).gutter).toEqual({
      blockStart: 24,
      blockEnd: 16,
      inlineStart: 16,
      inlineEnd: 20,
    })
  })

  it('lets the toast inset override the provider inset per edge', () => {
    const wrapper = mount(LayerProvider, {
      props: {
        inset: { blockEnd: 8, inlineEnd: 4 },
        toast: { inset: { blockEnd: 30 } },
      },
      slots: { default: () => h(Probe) },
    })

    expect(probeAttributes(wrapper).toastInset).toBe(JSON.stringify({
      blockEnd: 30,
      inlineEnd: 4,
    }))
  })

  it('ignores a nested provider', () => {
    const wrapper = mount(LayerProvider, {
      props: { inset: { blockStart: 8 } },
      slots: {
        default: () => h(LayerProvider, {
          inset: { blockStart: 100 },
          toast: { position: 'top-start' },
        }, { default: () => h(Probe) }),
      },
    })

    const attributes = probeAttributes(wrapper)
    expect(attributes.position).toBe('none')
  })

  it('lets a nested provider narrow the anchored layer inset, but keeps the root toast', () => {
    const wrapper = mount(LayerProvider, {
      props: { inset: { blockStart: 8 }, toast: { position: 'top-end' } },
      slots: {
        default: () => h('div', [
          h(LayerProvider, { inset: { blockStart: 100 } }, { default: () => h(Probe) }),
        ]),
      },
    })

    const attributes = probeAttributes(wrapper)
    // 子树里的锚定浮层按内层声明的常驻条算，blockStart 是 16 + 100。
    expect(attributes.gutter.blockStart).toBe(116)
    // toast 视口只有一份，仍然看根那层。
    expect(attributes.position).toBe('top-end')
  })

  it('renders nothing around the subtree', () => {
    const wrapper = mount(LayerProvider, {
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.html()).toBe('<span>content</span>')
  })
})

describe('toastViewport under a layerProvider', () => {
  afterEach(() => {
    purgeToasts()
    document.body.innerHTML = ''
  })

  it('takes the placement and the visible limit from the provider', async () => {
    const toast = useToast()
    const wrapper = mount(LayerProvider, {
      props: { toast: { position: 'top-end', maxVisible: 2 } },
      slots: { default: () => h(ToastViewport) },
      attachTo: document.body,
    })

    toast({ body: 'One', isAutoHide: false })
    toast({ body: 'Two', isAutoHide: false })
    toast({ body: 'Three', isAutoHide: false })
    await nextTick()

    const viewport = document.body.querySelector('.astryx-toast-viewport')
    expect(viewport?.classList.contains('astryx-toast-viewport--placement-top-end')).toBe(true)
    expect(document.body.querySelectorAll('.astryx-toast-viewport__row')).toHaveLength(2)
    expect(document.body.textContent).toContain('Three')
    expect(document.body.textContent).not.toContain('One')

    wrapper.unmount()
  })

  it('keeps the bottom-end placement without a provider', async () => {
    const toast = useToast()
    const wrapper = mount(ToastViewport, { attachTo: document.body })

    toast({ body: 'Plain', isAutoHide: false })
    await nextTick()

    const viewport = document.body.querySelector('.astryx-toast-viewport')
    expect(viewport?.classList.contains('astryx-toast-viewport--placement-bottom-end')).toBe(true)
    expect(viewport?.getAttribute('style')).toBeNull()

    wrapper.unmount()
  })

  it('moves the viewport in by the configured inset', async () => {
    const toast = useToast()
    const wrapper = mount(LayerProvider, {
      props: { toast: { inset: { blockEnd: 24 } } },
      slots: { default: () => h(ToastViewport) },
      attachTo: document.body,
    })

    toast({ body: 'Moved', isAutoHide: false })
    await nextTick()

    const viewport = document.body.querySelector<HTMLElement>('.astryx-toast-viewport')
    expect(viewport?.style.paddingBlockEnd).toContain('24px')

    wrapper.unmount()
  })
})

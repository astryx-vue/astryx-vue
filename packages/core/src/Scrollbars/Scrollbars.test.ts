import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import ScrollableArea from '../ScrollableArea/ScrollableArea.vue'
import { useScrollbars } from './useScrollbars.js'

interface FakeInstance {
  element: HTMLElement
  init: unknown
  options: ReturnType<typeof vi.fn>
  destroy: ReturnType<typeof vi.fn>
}

const mocks = vi.hoisted(() => ({
  instances: new Map<HTMLElement, unknown>(),
  created: [] as unknown[],
}))

vi.mock('overlayscrollbars', () => ({
  OverlayScrollbars: vi.fn((target: HTMLElement | { target: HTMLElement }, initialOptions?: unknown) => {
    if (target instanceof HTMLElement)
      return mocks.instances.get(target)
    const element = target.target
    const instance = {
      element,
      init: { target, options: initialOptions },
      options: vi.fn(),
      destroy: vi.fn(() => mocks.instances.delete(element)),
    }
    mocks.instances.set(element, instance)
    mocks.created.push(instance)
    return instance
  }),
}))

const { default: ScrollbarsProvider } = await import('./ScrollbarsProvider.vue')

const created = () => mocks.created as Array<FakeInstance & { init: { target: { target: HTMLElement, elements: { viewport: HTMLElement } }, options: any } }>

/** 只调一行 useScrollbars 的探针组件，模拟各个滚动容器的接入方式。 */
function createProbe(enabled?: () => boolean) {
  return defineComponent({
    props: { show: { type: Boolean, default: true } },
    setup(props, { expose }) {
      const el = ref<HTMLElement | null>(null)
      const { active } = useScrollbars(() => (props.show ? el.value : null), enabled ? { enabled } : undefined)
      expose({ active })
      return () => h('div', { ref: el, class: 'probe' })
    },
  })
}

function withProvider(providerProps: Record<string, unknown>, child: () => ReturnType<typeof h>) {
  return defineComponent({
    props: { providerProps: { type: Object, default: () => providerProps } },
    setup: props => () => h(ScrollbarsProvider, props.providerProps, { default: child }),
  })
}

beforeEach(() => {
  mocks.instances.clear()
  mocks.created.length = 0
})

describe('useScrollbars without a provider', () => {
  it('never touches OverlayScrollbars and stays inactive', async () => {
    const Probe = createProbe()
    const wrapper = mount(Probe)
    await nextTick()

    expect(mocks.created).toHaveLength(0)
    expect((wrapper.vm as unknown as { active: boolean }).active).toBe(false)
  })
})

describe('scrollbarsProvider', () => {
  it('initialises the container as its own viewport with the astryx theme', async () => {
    const Probe = createProbe()
    const wrapper = mount(withProvider({}, () => h(Probe)))
    await nextTick()

    const el = wrapper.get('.probe').element as HTMLElement
    expect(created()).toHaveLength(1)
    const { init } = created()[0]!
    expect(init.target).toEqual({ target: el, elements: { viewport: el } })
    expect(init.options.scrollbars).toMatchObject({ theme: 'os-theme-astryx', autoHide: 'scroll', autoHideDelay: 800 })
  })

  it('deep-merges the options prop on top and pushes changes to the live instance', async () => {
    const Probe = createProbe()
    const wrapper = mount(withProvider({ autoHide: 'move', options: { scrollbars: { clickScroll: true } } }, () => h(Probe)))
    await nextTick()

    const instance = created()[0]!
    expect(instance.init.options.scrollbars).toMatchObject({
      theme: 'os-theme-astryx',
      autoHide: 'move',
      clickScroll: true,
    })

    await wrapper.setProps({
      providerProps: { autoHide: 'move', options: { scrollbars: { autoHide: 'never' } } },
    })
    await nextTick()

    expect(instance.options).toHaveBeenCalledTimes(1)
    const [next, pure] = instance.options.mock.calls[0]!
    expect(pure).toBe(true)
    expect(next.scrollbars).toMatchObject({ theme: 'os-theme-astryx', autoHide: 'never' })
  })

  it('destroys when enabled turns false and mounts again when it turns true', async () => {
    const Probe = createProbe()
    const wrapper = mount(withProvider({ enabled: true }, () => h(Probe)))
    await nextTick()
    const first = created()[0]!

    await wrapper.setProps({ providerProps: { enabled: false } })
    await nextTick()
    expect(first.destroy).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ providerProps: { enabled: true } })
    await nextTick()
    expect(created()).toHaveLength(2)
  })

  it('lets a nested disabled provider switch off its subtree only', async () => {
    const Probe = createProbe()
    mount(withProvider({}, () => h('div', [
      h(Probe),
      h(ScrollbarsProvider, { enabled: false }, { default: () => h(Probe) }),
    ])))
    await nextTick()

    expect(created()).toHaveLength(1)
  })
})

describe('useScrollbars', () => {
  it('skips initialisation when its own enabled is false', async () => {
    const Probe = createProbe(() => false)
    mount(withProvider({}, () => h(Probe)))
    await nextTick()

    expect(mocks.created).toHaveLength(0)
  })

  it('reports active and destroys when the target disappears', async () => {
    const Probe = createProbe()
    const show = ref(true)
    const wrapper = mount(withProvider({}, () => h(Probe, { show: show.value })))
    await nextTick()
    expect(created()).toHaveLength(1)
    expect((wrapper.findComponent(Probe).vm as unknown as { active: boolean }).active).toBe(true)

    show.value = false
    await nextTick()
    await nextTick()
    expect((wrapper.findComponent(Probe).vm as unknown as { active: boolean }).active).toBe(false)
    expect(created()[0]!.destroy).toHaveBeenCalledTimes(1)
  })

  it('destroys when the component unmounts', async () => {
    const Probe = createProbe()
    const wrapper = mount(withProvider({}, () => h(Probe)))
    await nextTick()
    const instance = created()[0]!

    wrapper.unmount()

    expect(instance.destroy).toHaveBeenCalledTimes(1)
  })

  it('initialises a shared element once and keeps it alive when one side unmounts', async () => {
    const shared = document.createElement('div')
    const Sharer = defineComponent({
      setup() {
        useScrollbars(shared)
        return () => h('i')
      },
    })
    const showSecond = ref(true)
    const wrapper = mount(withProvider({}, () => h('div', [h(Sharer), showSecond.value ? h(Sharer) : null])))
    await nextTick()

    expect(created()).toHaveLength(1)

    showSecond.value = false
    await nextTick()
    expect(created()[0]!.destroy).not.toHaveBeenCalled()

    wrapper.unmount()
    expect(created()[0]!.destroy).toHaveBeenCalledTimes(1)
  })
})

describe('scrollableArea integration', () => {
  const area = (props: Record<string, unknown> = {}) => h(ScrollableArea, { label: 'List', ...props }, { default: () => 'x' })

  it('initialises inside a provider', async () => {
    const wrapper = mount(withProvider({}, () => area()))
    await nextTick()

    expect(created()).toHaveLength(1)
    expect(created()[0]!.element).toBe(wrapper.get('.astryx-scrollable-area').element)
  })

  it('keeps native scrollbars when scrollbars is false', async () => {
    mount(withProvider({}, () => area({ scrollbars: false })))
    await nextTick()

    expect(mocks.created).toHaveLength(0)
  })

  it('does not touch OverlayScrollbars outside a provider', async () => {
    mount(ScrollableArea, { props: { label: 'List' }, slots: { default: 'x' } })
    await nextTick()

    expect(mocks.created).toHaveLength(0)
  })
})

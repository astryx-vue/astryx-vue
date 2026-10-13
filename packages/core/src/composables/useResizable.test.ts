import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import ResizeHandle from '../Resizable/ResizeHandle.vue'
import { pixel } from '../Table/columnUtils.js'
import { percent, useResizable } from './useResizable.js'

const Host = defineComponent({
  setup() {
    const region = useResizable({
      defaultSize: 240,
      minSize: 160,
      maxSize: 360,
      collapsible: true,
      snaps: [200, 280],
    })
    return { region }
  },
  components: { ResizeHandle },
  template: `
    <div>
      <span class="size">{{ region.size }}</span>
      <span class="collapsed">{{ region.isCollapsed }}</span>
      <ResizeHandle direction="horizontal" has-divider label="Resize sidebar" :resizable="region.props" />
      <button type="button" class="expand" @click="region.expand()">Expand</button>
    </div>
  `,
})

describe('useResizable', () => {
  it('snaps to the nearest point and collapses below the threshold', async () => {
    const wrapper = mount(Host)
    expect(wrapper.get('.size').text()).toBe('240')
    const handle = wrapper.get('[role="separator"]')
    expect(handle.attributes('aria-orientation')).toBe('vertical')
    expect(handle.attributes('aria-valuenow')).toBe('240')

    await handle.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.get('.size').text()).toBe('230')

    wrapper.vm.region.resize(203)
    await nextTick()
    expect(wrapper.get('.size').text()).toBe('200')
    wrapper.vm.region.resize(220)
    await nextTick()
    expect(wrapper.get('.size').text()).toBe('220')

    wrapper.vm.region.resize(50)
    await nextTick()
    expect(wrapper.get('.collapsed').text()).toBe('false')
    wrapper.vm.region.collapse()
    await nextTick()
    expect(wrapper.get('.collapsed').text()).toBe('true')
    expect(wrapper.get('.size').text()).toBe('0')
    expect(handle.attributes('aria-valuetext')).toBe('Collapsed')
    expect(handle.attributes('aria-valuenow')).toBe('160')

    await wrapper.get('.expand').trigger('click')
    expect(wrapper.get('.collapsed').text()).toBe('false')
    expect(Number(wrapper.get('.size').text())).toBeGreaterThan(0)
  })

  it('builds a percent size with one pixel bound', () => {
    expect(percent(40, { min: pixel(120) })).toEqual({ type: 'percent', value: 40, min: { type: 'pixel', value: 120 } })
  })

  it('keeps named regions independent', async () => {
    const Hosts = defineComponent({
      setup() {
        const regions = useResizable({
          autoSaveId: 'board',
          regions: {
            main: { defaultSize: 300, minSize: 80 },
            side: { defaultSize: 180, minSize: 80 },
          },
        })
        return { regions }
      },
      template: '<span class="main">{{ regions.main.size }}</span><span class="side">{{ regions.side.size }}</span>',
    })
    const wrapper = mount(Hosts)
    expect(wrapper.get('.main').text()).toBe('300')
    expect(wrapper.get('.side').text()).toBe('180')
    wrapper.vm.regions.side.resize(100)
    await nextTick()
    expect(wrapper.get('.side').text()).toBe('100')
    expect(wrapper.get('.main').text()).toBe('300')
  })

  it('shrinks the lower shrinkOrder first, then restores it when the container grows', async () => {
    let width = 400
    const Hosts = defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null)
        const regions = useResizable({
          containerRef: container,
          regions: {
            main: { defaultSize: 300, minSize: 100, shrinkOrder: 2 },
            side: { defaultSize: 300, minSize: 100, shrinkOrder: 1 },
          },
        })
        return { container, regions }
      },
      template: '<div ref="container" class="box"></div><span class="side">{{ regions.side.size }}</span><span class="main">{{ regions.main.size }}</span>',
    })
    const wrapper = mount(Hosts)
    const box = wrapper.get('.box').element as HTMLElement
    Object.defineProperty(box, 'clientWidth', { configurable: true, get: () => width })

    wrapper.vm.regions.side.resize(300)
    await nextTick()
    expect(wrapper.get('.side').text()).toBe('100')
    expect(wrapper.get('.main').text()).toBe('300')

    width = 250
    wrapper.vm.regions.main.resize(300)
    await nextTick()
    expect(wrapper.get('.side').text()).toBe('100')
    expect(wrapper.get('.main').text()).toBe('150')

    width = 800
    wrapper.vm.regions.side.resize(300)
    await nextTick()
    expect(wrapper.get('.side').text()).toBe('300')
    expect(wrapper.get('.main').text()).toBe('300')
  })
})

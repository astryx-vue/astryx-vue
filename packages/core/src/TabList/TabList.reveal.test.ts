import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Tab from './Tab.vue'
import TabList from './TabList.vue'
import TabMenu from './TabMenu.vue'

function box(left: number, width: number): DOMRect {
  return { bottom: 20, height: 20, left, right: left + width, top: 0, width, x: left, y: 0, toJSON: () => ({}) } as DOMRect
}

function tabs() {
  return [
    h(Tab, { value: 'a' }, () => 'Tab A'),
    h(Tab, { value: 'b' }, () => 'Tab B'),
  ]
}

describe('选中的标签在下一帧才量', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('按下时已经因聚焦滚进可见区域的标签，选中后在下一帧收尾，不在按下里量', async () => {
    const frames: Array<() => void> = []
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const wrapper = mount(TabList, { attachTo: document.body, props: { value: 'a' }, slots: { default: tabs } })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    const scrolled: ScrollToOptions[] = []
    strip.scrollBy = (options) => {
      scrolled.push(typeof options === 'object' && options != null ? options : {})
    }
    let reads = 0
    strip.getBoundingClientRect = () => {
      reads += 1
      return box(0, 200)
    }
    const next = wrapper.get('[data-tab-value="b"]').element as HTMLElement
    next.getBoundingClientRect = () => box(150, 80)

    next.focus()
    await nextTick()
    // 聚焦本身把标签滚进了可见区域。
    expect(scrolled).toEqual([{ behavior: 'instant', left: 30 }])
    scrolled.length = 0
    reads = 0

    await wrapper.setProps({ value: 'b' })
    expect(reads).toBe(0)
    expect(frames).toHaveLength(1)

    // 选中的字重让标签变宽了。
    next.getBoundingClientRect = () => box(150, 100)
    frames[0]!()
    expect(scrolled).toEqual([{ behavior: 'instant', left: 50 }])
    wrapper.unmount()
  })

  it('没有因聚焦滚过的选中变化（外部设置 value）仍然立刻量', async () => {
    vi.stubGlobal('requestAnimationFrame', () => 1)
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const wrapper = mount(TabList, { attachTo: document.body, props: { value: 'a' }, slots: { default: tabs } })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    const scrolled: ScrollToOptions[] = []
    strip.scrollBy = (options) => {
      scrolled.push(typeof options === 'object' && options != null ? options : {})
    }
    strip.getBoundingClientRect = () => box(0, 200)
    const next = wrapper.get('[data-tab-value="b"]').element as HTMLElement
    next.getBoundingClientRect = () => box(400, 80)

    await wrapper.setProps({ value: 'b' })
    expect(scrolled).toEqual([{ behavior: 'instant', left: 280 }])
    wrapper.unmount()
  })

  it('失焦后不再延到下一帧', async () => {
    const frames: Array<() => void> = []
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    const wrapper = mount(TabList, { attachTo: document.body, props: { value: 'a' }, slots: { default: tabs } })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    strip.scrollBy = () => {}
    strip.getBoundingClientRect = () => box(0, 400)
    const next = wrapper.get('[data-tab-value="b"]').element as HTMLElement
    next.getBoundingClientRect = () => box(80, 80)
    next.focus()
    next.blur()
    await nextTick()
    await wrapper.setProps({ value: 'b' })
    expect(frames).toHaveLength(0)
    wrapper.unmount()
  })
})

describe('选中下划线是 tab-indicator 部位', () => {
  it('选中的标签带一个 tab-indicator 元素，没选中的没有', () => {
    const wrapper = mount(TabList, { props: { value: 'a' }, slots: { default: tabs } })
    const [selected, other] = wrapper.findAll('.astryx-tab')
    expect(selected!.find('.astryx-tab-indicator').exists()).toBe(true)
    expect(selected!.get('.astryx-tab-indicator').attributes('aria-hidden')).toBe('true')
    expect(other!.find('.astryx-tab-indicator').exists()).toBe(false)
  })

  it('tabMenu 里选了某一项时它的触发器也带下划线', () => {
    const wrapper = mount(TabList, {
      props: { value: 'x' },
      slots: { default: () => h(TabMenu, { label: 'More', options: [{ label: 'X', value: 'x' }, { label: 'Y', value: 'y' }] }) },
    })
    expect(wrapper.get('.astryx-tab-menu').find('.astryx-tab-indicator').exists()).toBe(true)
  })
})

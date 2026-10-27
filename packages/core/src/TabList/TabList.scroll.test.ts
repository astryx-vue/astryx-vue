import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Tab from './Tab.vue'
import TabList from './TabList.vue'

function box(left: number, width: number): DOMRect {
  return {
    bottom: 20,
    height: 20,
    left,
    right: left + width,
    top: 0,
    width,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

function paintStrip(strip: HTMLElement, metrics: { clientWidth: number, scrollLeft: number, scrollWidth: number }): void {
  Object.defineProperty(strip, 'clientWidth', { configurable: true, get: () => metrics.clientWidth })
  Object.defineProperty(strip, 'scrollWidth', { configurable: true, get: () => metrics.scrollWidth })
  Object.defineProperty(strip, 'scrollLeft', {
    configurable: true,
    get: () => metrics.scrollLeft,
    set: (value: number) => {
      metrics.scrollLeft = value
    },
  })
}

function tabs() {
  return [
    h(Tab, { value: 'a' }, () => 'Tab A'),
    h(Tab, { value: 'b' }, () => 'Tab B'),
  ]
}

describe('tab list scroll', () => {
  it('marks enabled tabs for the touch press model', () => {
    const wrapper = mount(TabList, {
      props: { value: 'a' },
      slots: { default: () => [h(Tab, { value: 'a' }, () => 'A'), h(Tab, { value: 'b', disabled: true }, () => 'B')] },
    })
    const [enabled, disabled] = wrapper.findAll('.astryx-tab')
    expect(enabled.attributes('data-astryx-pressable')).toBe('')
    expect(disabled.attributes('data-astryx-pressable')).toBeUndefined()
  })

  it('shows an end arrow and scrolls by 80 percent of the visible width', async () => {
    const wrapper = mount(TabList, {
      props: { value: 'a' },
      slots: { default: tabs },
    })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    expect(strip.classList.contains('astryx-tab-list__strip--scroll')).toBe(true)
    const scrolled: ScrollToOptions[] = []
    strip.scrollBy = (options) => {
      scrolled.push(typeof options === 'object' && options != null ? options : {})
    }
    paintStrip(strip, { clientWidth: 300, scrollLeft: 0, scrollWidth: 600 })
    strip.dispatchEvent(new Event('scroll'))
    await nextTick()

    const arrows = wrapper.findAll('.astryx-tab-scroll-button')
    expect(arrows).toHaveLength(1)
    expect(arrows[0].classes()).toContain('astryx-tab-scroll-button--end')
    expect(arrows[0].attributes('aria-hidden')).toBe('true')
    expect(arrows[0].attributes('tabindex')).toBe('-1')

    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    arrows[0].element.dispatchEvent(press)
    expect(press.defaultPrevented).toBe(true)

    await arrows[0].trigger('click')
    expect(scrolled).toEqual([{ left: 240 }])
  })

  it('shows both arrows once the strip has scrolled away from the start', async () => {
    const wrapper = mount(TabList, {
      props: { overflow: 'scroll', value: 'a' },
      slots: { default: tabs },
    })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    paintStrip(strip, { clientWidth: 300, scrollLeft: 150, scrollWidth: 600 })
    strip.dispatchEvent(new Event('scroll'))
    await nextTick()

    const arrows = wrapper.findAll('.astryx-tab-scroll-button')
    expect(arrows).toHaveLength(2)
    expect(strip.classList.contains('astryx-tab-list__strip--fade-both')).toBe(true)
  })

  it('does not scroll when overflow is visible', async () => {
    const wrapper = mount(TabList, {
      props: { overflow: 'visible', value: 'a' },
      slots: { default: tabs },
    })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    const scrolled: unknown[] = []
    strip.scrollBy = (options) => {
      scrolled.push(options)
    }
    paintStrip(strip, { clientWidth: 300, scrollLeft: 0, scrollWidth: 600 })
    strip.dispatchEvent(new Event('scroll'))
    await wrapper.setProps({ value: 'b' })
    await nextTick()

    expect(strip.classList.contains('astryx-tab-list__strip--scroll')).toBe(false)
    expect(wrapper.find('.astryx-tab-scroll-button').exists()).toBe(false)
    expect(scrolled).toEqual([])
  })

  it('scrolls a selected tab that sits past the end into view immediately', async () => {
    const wrapper = mount(TabList, {
      props: { value: 'a' },
      slots: { default: tabs },
    })
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
  })

  it('leaves a selected tab alone when it is already in view', async () => {
    const wrapper = mount(TabList, {
      props: { value: 'a' },
      slots: { default: tabs },
    })
    const strip = wrapper.get('.astryx-tab-list__strip').element as HTMLElement
    const scrolled: unknown[] = []
    strip.scrollBy = () => {
      scrolled.push(true)
    }
    strip.getBoundingClientRect = () => box(0, 400)
    const next = wrapper.get('[data-tab-value="b"]').element as HTMLElement
    next.getBoundingClientRect = () => box(80, 80)

    await wrapper.setProps({ value: 'b' })
    expect(scrolled).toEqual([])
  })

  it('leaves vertical arrows to the page in the tabs pattern', async () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: { default: tabs },
    })
    await wrapper.get('[role="tab"]').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:value')).toBeFalsy()
  })

  it('does not render a javascript href as a link', () => {
    const wrapper = mount(TabList, {
      props: { value: 'bad' },
      slots: {
        default: () => h(Tab, { href: 'javascript:alert(1)', value: 'bad' }, () => 'Bad'),
      },
    })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('button').text()).toContain('Bad')
  })
})

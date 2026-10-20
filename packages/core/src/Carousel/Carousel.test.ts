import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Carousel from './Carousel.vue'
import { readOverflow } from './useCarouselScroll.js'

enableAutoUnmount(afterEach)

const Host = defineComponent({
  components: { Carousel },
  template: `
    <Carousel label="Feature cards" :gap="2" has-snap>
      <div class="card">One</div>
      <div class="card">Two</div>
      <div class="card">Three</div>
    </Carousel>
  `,
})

describe('carousel', () => {
  it('names the region and each slide', () => {
    const wrapper = mount(Host)
    const region = wrapper.get('[role="region"]')
    expect(region.attributes('aria-roledescription')).toBe('carousel')
    expect(region.attributes('aria-label')).toBe('Feature cards')
    const slides = wrapper.findAll('[aria-roledescription="slide"]')
    expect(slides.map(slide => slide.attributes('aria-label'))).toEqual([
      'Slide 1 of 3',
      'Slide 2 of 3',
      'Slide 3 of 3',
    ])
    expect(wrapper.get('.astryx-carousel__scroller').attributes('data-snap')).toBe('true')
    expect(wrapper.get('.astryx-carousel__scroller').attributes('data-gap')).toBe('2')
  })

  it('hides the navigation buttons when they are turned off', () => {
    const wrapper = mount(Carousel, {
      props: { hasButtons: false, label: 'Quiet' },
      slots: { default: () => [h('div', 'Only')] },
    })
    expect(wrapper.find('.astryx-carousel__controls').exists()).toBe(false)
  })

  it('exposes scroll methods on the component instance', () => {
    const wrapper = mount(Host)
    const exposed = wrapper.getComponent(Carousel).vm as unknown as {
      scrollNext: () => void
      canScrollNext: () => boolean
    }
    expect(typeof exposed.scrollNext).toBe('function')
    expect(exposed.canScrollNext()).toBe(false)
  })

  it('reads logical overflow from the scroll metrics', () => {
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollWidth', { value: 400 })
    Object.defineProperty(element, 'clientWidth', { value: 100 })
    Object.defineProperty(element, 'scrollLeft', { value: 0, writable: true })
    expect(readOverflow(element)).toEqual({ hasOverflow: true, overflowStart: false, overflowEnd: true })
    element.scrollLeft = 300
    expect(readOverflow(element)).toEqual({ hasOverflow: true, overflowStart: true, overflowEnd: false })
  })

  describe('slot content', () => {
    function slides(wrapper: ReturnType<typeof mount>): string[] {
      return wrapper.findAll('[aria-roledescription="slide"]').map(slide => slide.text())
    }

    it('reads the slot while rendering, so Vue has nothing to warn about', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(Carousel, { slots: { default: () => [h('div', 'One'), h('div', 'Two')] } })
      const slotWarnings = warn.mock.calls.filter(call => String(call[0]).includes('Slot "default" invoked outside of the render function'))
      warn.mockRestore()
      expect(slotWarnings).toHaveLength(0)
    })

    it('follows a slot whose content comes from a plain local in the parent render function', async () => {
      const version = ref(0)
      const Parent = defineComponent({
        setup() {
          return () => {
            // 局部常量不是响应式的：只有父组件重渲染、传下新的插槽函数，才能把变化带给轮播。
            const names = version.value === 0 ? ['One', 'Two'] : ['One', 'Two', 'Three']
            return h(Carousel, null, { default: () => names.map(name => h('div', { key: name }, name)) })
          }
        },
      })
      const wrapper = mount(Parent)
      expect(slides(wrapper)).toEqual(['One', 'Two'])

      version.value = 1
      await nextTick()
      expect(slides(wrapper)).toEqual(['One', 'Two', 'Three'])
      expect(wrapper.findAll('[aria-roledescription="slide"]').map(slide => slide.attributes('aria-label')))
        .toEqual(['Slide 1 of 3', 'Slide 2 of 3', 'Slide 3 of 3'])
    })

    it('follows reactive data read inside the slot', async () => {
      const names = ref(['One'])
      const Parent = defineComponent({
        components: { Carousel },
        setup: () => ({ names }),
        template: '<Carousel><div v-for="name in names" :key="name">{{ name }}</div></Carousel>',
      })
      const wrapper = mount(Parent)
      names.value = ['One', 'Two']
      await nextTick()
      expect(slides(wrapper)).toEqual(['One', 'Two'])
    })

    it('measures the overflow again after the slides change', async () => {
      const count = ref(1)
      const Parent = defineComponent({
        setup() {
          return () => h(Carousel, null, {
            default: () => Array.from({ length: count.value }, (_, index) => h('div', { key: index }, String(index))),
          })
        },
      })
      const wrapper = mount(Parent)
      const scroller = wrapper.get('.astryx-carousel__scroller').element
      const exposed = wrapper.getComponent(Carousel).vm as unknown as { canScrollNext: () => boolean }
      expect(exposed.canScrollNext()).toBe(false)

      // 新增的卡片把内容撑宽，轮播要重新量一遍才知道右边还有内容。
      Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 400 })
      Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 100 })
      count.value = 4
      await nextTick()
      await nextTick()
      expect(exposed.canScrollNext()).toBe(true)
    })
  })
})

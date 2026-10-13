import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Carousel from './Carousel.vue'
import { readOverflow } from './useCarouselScroll.js'

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
})

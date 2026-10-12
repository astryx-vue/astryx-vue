import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AspectRatio from './AspectRatio.vue'

describe('aspect ratio', () => {
  it('keeps the ratio on a custom property so a class can still override it', () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 16 / 9 },
      slots: { default: '<img alt="Wide" src="wide.png">' },
    })

    expect(wrapper.classes()).toContain('astryx-aspect-ratio')
    expect(wrapper.attributes('data-shape')).toBe('rectangle')
    expect(wrapper.element.style.getPropertyValue('--astryx-aspect-ratio')).toBe(String(16 / 9))
    expect(wrapper.element.style.aspectRatio).toBe('')
    expect(wrapper.get('img').attributes('alt')).toBe('Wide')
  })

  it('clips to an ellipse and marks the fit for the child sizing rules', () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 1, shape: 'ellipse', fit: 'cover' },
      slots: { default: '<img alt="" src="face.png">' },
    })

    expect(wrapper.attributes('data-shape')).toBe('ellipse')
    const child = wrapper.get('.astryx-aspect-ratio__child')
    expect(child.attributes('data-fit')).toBe('cover')
    expect(child.attributes('data-astryx-aspect-ratio-override')).toBe('cover')
  })

  it('leaves the fit marker off when the child sizes itself', () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 4 / 3, fit: 'center' },
      slots: { default: '<span>4:3</span>' },
    })

    expect(wrapper.get('.astryx-aspect-ratio__child').attributes('data-fit')).toBe('center')
  })

  it('forwards attributes and merges class', () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 1 },
      attrs: { 'class': 'hero', 'data-testid': 'ratio', 'style': 'max-width: 12rem' },
    })

    expect(wrapper.classes()).toContain('hero')
    expect(wrapper.attributes('data-testid')).toBe('ratio')
    expect(wrapper.element.style.maxWidth).toBe('12rem')
  })
})

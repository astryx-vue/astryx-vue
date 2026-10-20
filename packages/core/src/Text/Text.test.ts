import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Text from './Text.vue'

describe('text', () => {
  it('renders a span by default', () => {
    const wrapper = mount(Text, {
      slots: { default: 'Body text' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('Body text')
  })

  it('renders the requested element via as prop', () => {
    const wrapper = mount(Text, {
      props: { as: 'p' },
      slots: { default: 'Paragraph' },
    })

    expect(wrapper.element.tagName).toBe('P')
  })

  it('renders heading tags via as prop and keeps the text classes', () => {
    const wrapper = mount(Text, {
      props: { as: 'h2', type: 'display-1' },
      slots: { default: 'Heading' },
    })

    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('astryx-text--type-display-1')
  })

  it('applies type and size classes', () => {
    const wrapper = mount(Text, {
      props: { type: 'supporting', size: 'sm' },
      slots: { default: 'Hint' },
    })

    expect(wrapper.classes()).toContain('astryx-text--type-supporting')
    expect(wrapper.classes()).toContain('astryx-text--size-sm')
  })

  it('maps normal weight onto the regular weight class', () => {
    const wrapper = mount(Text, {
      props: { weight: 'normal' },
      slots: { default: 'Normal' },
    })

    expect(wrapper.classes()).toContain('astryx-text--weight-regular')
  })

  it('applies wrap, word break, strikethrough, and tabular classes', () => {
    const wrapper = mount(Text, {
      props: {
        textWrap: 'balance',
        wordBreak: 'break-all',
        hasStrikethrough: true,
        hasTabularNumbers: true,
        color: 'disabled',
      },
      slots: { default: 'Styled' },
    })

    expect(wrapper.classes()).toContain('astryx-text--wrap-balance')
    expect(wrapper.classes()).toContain('astryx-text--word-break-all')
    expect(wrapper.classes()).toContain('astryx-text--strike')
    expect(wrapper.classes()).toContain('astryx-text--tabular')
    expect(wrapper.classes()).toContain('astryx-text--color-disabled')
  })

  it('truncates to multiple lines when maxLines is greater than 1', () => {
    const wrapper = mount(Text, {
      props: { maxLines: 2 },
      slots: { default: 'Long text' },
    })

    const text = wrapper.get('.astryx-text')
    expect(text.classes()).toContain('astryx-text--truncate-multi')
    expect(text.classes()).toContain('astryx-text--block')
  })

  it('forces a block box when maxLines is 1 so the ellipsis has a width', () => {
    const wrapper = mount(Text, {
      props: { maxLines: 1 },
      slots: { default: 'Long text' },
    })

    const text = wrapper.get('.astryx-text')
    expect(text.classes()).toContain('astryx-text--truncate-single')
    expect(text.classes()).toContain('astryx-text--block')
    expect(text.element.parentElement?.tagName).not.toBe('SPAN')
  })

  it('aligns a block of text without opening a tooltip until it is truncated', () => {
    const wrapper = mount(Text, {
      props: { as: 'p', justify: 'end', hasTruncateTooltip: false, maxLines: 1 },
      slots: { default: 'Aligned' },
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('astryx-text--justify-end')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('trims the leading with hasCapsize and forces a block box', () => {
    const plain = mount(Text, { slots: { default: 'Body' } })
    expect(plain.classes()).not.toContain('astryx-text--capsize')
    expect(plain.classes()).not.toContain('astryx-text--block')

    const capsize = mount(Text, { props: { hasCapsize: true, display: 'inline' }, slots: { default: 'Body' } })
    expect(capsize.classes()).toContain('astryx-text--capsize')
    expect(capsize.classes()).toContain('astryx-text--block')
  })
})

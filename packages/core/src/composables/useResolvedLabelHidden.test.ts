import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useResolvedLabelHidden } from './useResolvedLabelHidden.js'

function probe(fallback: boolean) {
  return defineComponent({
    props: {
      isLabelHidden: Boolean,
      labelHidden: Boolean,
    },
    setup(props) {
      const hidden = useResolvedLabelHidden(
        () => props.isLabelHidden,
        () => props.labelHidden,
        fallback,
      )
      return () => h('div', { 'data-hidden': hidden.value ? 'true' : 'false' })
    },
  })
}

describe('useResolvedLabelHidden', () => {
  it('hides when either name is true and the default is visible', () => {
    const Probe = probe(false)
    expect(mount(Probe).get('div').attributes('data-hidden')).toBe('false')
    expect(mount(Probe, { props: { isLabelHidden: true } }).get('div').attributes('data-hidden')).toBe('true')
    expect(mount(Probe, { props: { labelHidden: true } }).get('div').attributes('data-hidden')).toBe('true')
    expect(mount(Probe, { props: { isLabelHidden: false, labelHidden: true } }).get('div').attributes('data-hidden')).toBe('true')
  })

  it('treats an omitted flag as hidden when that is the default', () => {
    const Probe = probe(true)
    expect(mount(Probe).get('div').attributes('data-hidden')).toBe('true')
    expect(mount(Probe, { props: { isLabelHidden: false } }).get('div').attributes('data-hidden')).toBe('false')
    expect(mount(Probe, { props: { labelHidden: false } }).get('div').attributes('data-hidden')).toBe('false')
    expect(mount(Probe, { props: { isLabelHidden: false, labelHidden: true } }).get('div').attributes('data-hidden')).toBe('false')
    expect(mount(Probe, { props: { isLabelHidden: true } }).get('div').attributes('data-hidden')).toBe('true')
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h, provide } from 'vue'
import { themeContextKey } from '../Theme/context.js'
import { defineTheme } from '../Theme/defineTheme.js'
import TreeList from './TreeList.vue'

const items = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [{ id: 'app', label: 'App', onClick: () => {} }],
  },
  { id: 'lib', label: 'lib', children: [{ id: 'x', label: 'x', onClick: () => {} }] },
]

const Disclosure = defineComponent({
  props: { state: { type: String, required: true } },
  setup: props => () => h('b', { 'class': 'brand-disclosure', 'data-state': props.state }),
})

function mountWithTheme(indicators?: Record<string, unknown>) {
  const theme = defineTheme({ name: 'tree-disclosure-theme', indicators: indicators as never })
  return mount(defineComponent({
    setup() {
      provide(themeContextKey, computed(() => ({ theme, mode: 'light' as const })))
      return () => h(TreeList, { items, label: 'Files' })
    },
  }))
}

describe('tree list disclosure theme seam', () => {
  it('draws the theme\'s tree-disclosure mark with the row\'s open or closed state', () => {
    const wrapper = mountWithTheme({ 'tree-disclosure': Disclosure })
    const marks = wrapper.findAll('.brand-disclosure')
    expect(marks.map(mark => mark.attributes('data-state'))).toEqual(['expanded', 'collapsed'])
    expect(wrapper.find('.astryx-tree-list__chevron .astryx-icon').exists()).toBe(false)
  })

  it('keeps the built-in chevron without a theme mark', () => {
    const wrapper = mountWithTheme()
    expect(wrapper.findAll('.astryx-tree-list__chevron .astryx-icon')).toHaveLength(2)
  })
})

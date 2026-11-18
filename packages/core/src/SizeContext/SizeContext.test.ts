import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Button from '../Button/Button.vue'
import ButtonGroup from '../ButtonGroup/ButtonGroup.vue'
import MoreMenu from '../MoreMenu/MoreMenu.vue'
import TextInput from '../TextInput/TextInput.vue'
import Toolbar from '../Toolbar/Toolbar.vue'
import { SizeProvider, useSize } from './SizeContext.js'

describe('sizeProvider', () => {
  it('lets a Button inherit the provided size', () => {
    const wrapper = mount(() => h(SizeProvider, { value: 'sm' }, () => h(Button, { label: 'Save' })))
    expect(wrapper.find('button').attributes('data-size')).toBe('sm')
  })

  it('lets an explicit size win over the context', () => {
    const wrapper = mount(() => h(SizeProvider, { value: 'sm' }, () => h(Button, { label: 'Save', size: 'lg' })))
    expect(wrapper.find('button').attributes('data-size')).toBe('lg')
  })

  it('falls back to md without a provider', () => {
    const wrapper = mount(() => h(Button, { label: 'Save' }))
    expect(wrapper.find('button').attributes('data-size')).toBe('md')
  })

  it('follows a changing provider value', async () => {
    const wrapper = mount(defineComponent({
      props: { size: { type: String, default: 'sm' } },
      setup: props => () => h(SizeProvider, { value: props.size as 'sm' | 'lg' }, () => h(Button, { label: 'Save' })),
    }))
    expect(wrapper.find('button').attributes('data-size')).toBe('sm')
    await wrapper.setProps({ size: 'lg' })
    expect(wrapper.find('button').attributes('data-size')).toBe('lg')
  })

  it('cascades through nested providers, innermost wins', () => {
    const wrapper = mount(() => h(SizeProvider, { value: 'sm' }, () => h(SizeProvider, { value: 'lg' }, () => h(Button, { label: 'Save' }))))
    expect(wrapper.find('button').attributes('data-size')).toBe('lg')
  })

  it('resolves prop, then context, then default through useSize', () => {
    const Probe = defineComponent({
      props: { size: { type: String, default: undefined } },
      setup: (props) => {
        const size = useSize(() => props.size as 'sm' | undefined, 'md')
        return () => h('i', { 'data-size': size.value })
      },
    })
    expect(mount(Probe).attributes('data-size')).toBe('md')
    expect(mount(() => h(SizeProvider, { value: 'lg' }, () => h(Probe))).find('i').attributes('data-size')).toBe('lg')
    expect(mount(() => h(SizeProvider, { value: 'lg' }, () => h(Probe, { size: 'sm' }))).find('i').attributes('data-size')).toBe('sm')
  })
})

describe('size cascading containers', () => {
  it('toolbar cascades its size to Button, MoreMenu and TextInput', () => {
    const wrapper = mount(() => h(Toolbar, { label: 'Actions', size: 'sm' }, {
      start: () => [
        h(Button, { label: 'Edit' }),
        h(MoreMenu, { items: [{ type: 'item', label: 'Copy', value: 'copy' }] as never }),
        h(TextInput, { label: 'Search', isLabelHidden: true, modelValue: '' }),
      ],
    }))
    expect(wrapper.find('.astryx-button').attributes('data-size')).toBe('sm')
    expect(wrapper.find('.astryx-more-menu').attributes('data-size')).toBe('sm')
    expect(wrapper.find('[data-size="sm"].astryx-text-input, .astryx-text-input[data-size="sm"], [data-size="sm"] input').exists()).toBe(true)
  })

  it('buttonGroup cascades its size to its buttons', () => {
    const wrapper = mount(() => h(ButtonGroup, { size: 'lg' }, () => [h(Button, { label: 'A' }), h(Button, { label: 'B', size: 'sm' })]))
    const sizes = wrapper.findAll('button').map(b => b.attributes('data-size'))
    expect(sizes).toEqual(['lg', 'sm'])
  })
})

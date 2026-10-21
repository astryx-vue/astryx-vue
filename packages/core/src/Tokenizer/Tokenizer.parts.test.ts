import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

describe('tokenizer 样式分层', () => {
  it('container 落在外壳，根 class 落在外框，不落到 input', () => {
    const wrapper = mount(Tokenizer, {
      props: {
        label: 'Tags',
        searchSource: createStaticSource([{ id: 'a', label: 'Apple' }]),
        containerClass: 'box-a',
        controlClass: 'ctl-a',
      },
      attrs: { class: 'root-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    const control = wrapper.get('.astryx-tokenizer-control')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect(wrapper.get('input.astryx-tokenizer-input').classes()).not.toContain('root-a')
  })
})

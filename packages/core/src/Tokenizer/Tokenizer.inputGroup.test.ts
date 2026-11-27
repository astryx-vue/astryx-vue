import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import InputGroup from '../InputGroup/InputGroup.vue'
import Tokenizer from './Tokenizer.vue'

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

function mountGrouped(tokenizerProps: Record<string, unknown> = {}, groupProps: Record<string, unknown> = {}) {
  return mount(InputGroup, {
    attachTo: document.body,
    props: { label: 'Owners', description: 'Who can edit', status: { type: 'error', message: 'Pick someone' }, ...groupProps },
    slots: {
      default: () => h(Tokenizer, {
        label: 'People',
        modelValue: people,
        searchSource: createStaticSource(people),
        description: 'Local description',
        status: 'warning',
        statusMessage: 'Local status',
        ...tokenizerProps,
      }),
    },
  })
}

describe('tokenizer 放进 InputGroup', () => {
  it('不画自己的描述、状态和必填标记，交给组', () => {
    const wrapper = mountGrouped({ required: true })
    expect(wrapper.text()).not.toContain('Local description')
    expect(wrapper.text()).not.toContain('Local status')
    const tokenizer = wrapper.get('.astryx-tokenizer')
    expect(tokenizer.classes()).toContain('in-group')
    expect(tokenizer.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    // 组里的外框没有本地状态色。
    expect(wrapper.get('.astryx-tokenizer-control').classes()).not.toContain('status-warning')
    wrapper.unmount()
  })

  it('输入框由组标签加自己的标签命名，说明读组的，不指向不存在的本地元素', () => {
    const wrapper = mountGrouped()
    const group = wrapper.get('[role="group"]')
    const input = wrapper.get('input[role="combobox"]')
    const groupLabelId = group.attributes('aria-labelledby')!
    const names = input.attributes('aria-labelledby')!.split(' ')
    expect(names[0]).toBe(groupLabelId)
    expect(names).toHaveLength(2)
    expect(document.getElementById(names[1]!)?.textContent).toContain('People')
    const described = input.attributes('aria-describedby')!.split(' ')
    expect(described).toEqual(group.attributes('aria-describedby')!.split(' '))
    expect(described.every(id => document.getElementById(id) != null)).toBe(true)
    wrapper.unmount()
  })

  it('尺寸跟组走，自己的 size 不能盖过它', () => {
    const wrapper = mountGrouped({ size: 'lg' }, { size: 'sm' })
    expect(wrapper.get('.astryx-tokenizer').classes()).toContain('size-sm')
    expect(wrapper.get('.astryx-token').classes()).toContain('size-sm')
    wrapper.unmount()
  })

  it('单独使用时 size 仍然生效', () => {
    const wrapper = mount(Tokenizer, {
      props: { label: 'People', modelValue: people, searchSource: createStaticSource(people), size: 'lg' },
    })
    expect(wrapper.get('.astryx-tokenizer').classes()).toContain('size-lg')
    wrapper.unmount()
  })

  it('组禁用时，字段、标签和清除按钮都跟着禁用', () => {
    const wrapper = mountGrouped({ hasClear: true }, { disabled: true })
    expect(wrapper.get('input[role="combobox"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('.astryx-tokenizer-control').classes()).toContain('is-disabled')
    expect(wrapper.find('.astryx-tokenizer-clear').exists()).toBe(false)
    wrapper.unmount()
  })

  it('标签和输入留在一条横向滚动的轨道里，结尾的控件在轨道外面', () => {
    const wrapper = mountGrouped({ hasClear: true })
    const track = wrapper.get('.astryx-tokenizer-track')
    expect(track.find('.astryx-tokenizer-token').exists()).toBe(true)
    expect(track.find('input[role="combobox"]').exists()).toBe(true)
    expect(track.find('.astryx-tokenizer-clear').exists()).toBe(false)
    wrapper.unmount()
  })

  it('不在组里时不画轨道，也不改原来的标签和说明', () => {
    const wrapper = mount(Tokenizer, {
      props: {
        label: 'People',
        description: 'Local description',
        modelValue: people,
        searchSource: createStaticSource(people),
      },
    })
    expect(wrapper.find('.astryx-tokenizer-track').exists()).toBe(false)
    expect(wrapper.text()).toContain('Local description')
    expect(wrapper.get('.astryx-tokenizer').classes()).not.toContain('in-group')
    wrapper.unmount()
  })
})

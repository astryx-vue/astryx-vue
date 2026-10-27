import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ComplexSelector from './ComplexSelector.vue'

describe('complex selector 样式分层', () => {
  it('根 class 和 container 落在外壳，control 落在按钮', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Range', modelValue: 'week', triggerLabel: 'Week', containerClass: 'box-a', controlClass: 'ctl-a' },
      attrs: { class: 'root-a', style: { marginTop: '4px' } },
      slots: { default: () => 'body' },
    })
    const field = wrapper.get('.astryx-field')
    expect(field.classes()).toEqual(expect.arrayContaining(['root-a', 'box-a']))
    expect((field.element as HTMLElement).style.marginTop).toBe('4px')
    const button = wrapper.get('button.astryx-complex-selector')
    expect(button.classes()).toContain('ctl-a')
    expect(button.classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('secondary 无边框，禁用光标是 default，attached 状态脱离控件', () => {
    const wrapper = mount(ComplexSelector, {
      props: {
        label: 'Range',
        modelValue: 'week',
        triggerLabel: 'Week',
        variant: 'secondary',
        status: { type: 'error', message: 'Bad' },
        statusVariant: 'attached',
      },
      slots: { default: () => 'body' },
    })
    const button = wrapper.get('button.astryx-complex-selector')
    expect(button.attributes('data-variant')).toBe('secondary')
    expect(button.attributes('data-status')).toBeUndefined()
    expect(wrapper.get('.astryx-field').attributes('data-status-variant')).toBe('detached')
  })

  it('自定义触发器收到 container 或 control 时给出开发警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      components: { ComplexSelector },
      setup() {
        return () => h(ComplexSelector, {
          label: 'Range',
          modelValue: 'week',
          containerClass: 'box-a',
          renderTrigger: (props: { id: string }) => h('button', { id: props.id, type: 'button' }, 'Open'),
        }, { default: () => 'body' })
      },
    })
    mount(Host)
    expect(warn.mock.calls.some(call => String(call[0]).includes('custom trigger'))).toBe(true)
  })
})

describe('complex selector 弹层内容', () => {
  it('内边距在内容容器上，contentClass / contentStyle 落在同一个容器', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fields', modelValue: [], triggerLabel: 'Pick', contentClass: 'wide', contentStyle: { padding: '0px', width: '40rem' } },
      slots: { default: () => 'body' },
      attachTo: document.body,
    })
    await wrapper.get('button.astryx-complex-selector').trigger('click')
    await nextTick()
    // 前面的用例留下的浮层还在 body 里，按这个用例自己的 class 找。
    const content = document.querySelector<HTMLElement>('.astryx-complex-selector-content.wide')
    expect(content).not.toBeNull()
    expect(content!.classList.contains('wide')).toBe(true)
    expect(content!.style.padding).toBe('0px')
    expect(content!.style.width).toBe('40rem')
    const surface = content!.closest<HTMLElement>('.astryx-popover')
    expect(surface?.style.getPropertyValue('--_popover-padding')).toBe('var(--astryx-spacing-0)')
    wrapper.unmount()
  })

  it('popupWidth 传给 Popover 外壳；不传时仍按触发器宽度', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Wide', modelValue: [], triggerLabel: 'Pick', popupWidth: '41rem', contentClass: 'wide-popup' },
      slots: { default: () => 'body' },
      attachTo: document.body,
    })
    await wrapper.get('button.astryx-complex-selector').trigger('click')
    await nextTick()
    const surface = document.querySelector('.astryx-complex-selector-content.wide-popup')!.closest<HTMLElement>('.astryx-popover')!
    expect(surface.style.width).toBe('41rem')
    wrapper.unmount()
    const plain = mount(ComplexSelector, {
      props: { label: 'Plain', modelValue: [], triggerLabel: 'Pick', contentClass: 'plain-popup' },
      slots: { default: () => 'body' },
      attachTo: document.body,
    })
    await plain.get('button.astryx-complex-selector').trigger('click')
    await nextTick()
    const plainSurface = document.querySelector('.astryx-complex-selector-content.plain-popup')!.closest<HTMLElement>('.astryx-popover')!
    expect(plainSurface.style.width).toBe('')
    plain.unmount()
  })
})

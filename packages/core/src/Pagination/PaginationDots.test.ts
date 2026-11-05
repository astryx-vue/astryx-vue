import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pagination from './Pagination.vue'

function renderDots(isDisabled = false) {
  const wrapper = mount(Pagination, {
    attachTo: document.body,
    props: { page: 1, totalPages: 4, variant: 'dots', isDisabled },
  })
  const dots = wrapper.findAll<HTMLButtonElement>('.astryx-pagination-dot')
  return { wrapper, dots }
}

describe('pagination dots 键盘与禁用状态', () => {
  it('方向键移动焦点并换页，只保留一个 Tab 停靠点', async () => {
    const { wrapper, dots } = renderDots()
    expect(dots.map(dot => dot.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])

    ;(dots[0]!.element as HTMLButtonElement).focus()
    await dots[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(dots[1]!.element)
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([2])
    expect(dots.map(dot => dot.attributes('tabindex'))).toEqual(['-1', '0', '-1', '-1'])

    await dots[1]!.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([4])
    expect(dots.map(dot => dot.attributes('tabindex'))).toEqual(['-1', '-1', '-1', '0'])

    await dots[3]!.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    wrapper.unmount()
  })

  it('禁用圆点保留当前 Tab 位和焦点，但不响应点击、键盘或聚焦换页', async () => {
    const { wrapper, dots } = renderDots(true)
    expect(wrapper.findAll('.astryx-pagination-dot[disabled]')).toHaveLength(0)
    expect(dots.map(dot => dot.attributes('aria-disabled'))).toEqual(['true', 'true', 'true', 'true'])
    expect(dots.map(dot => dot.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])

    const active = dots[0]!.element as HTMLButtonElement
    active.focus()
    expect(document.activeElement).toBe(active)
    active.click()
    await dots[0]!.trigger('keydown', { key: 'Enter' })
    await dots[0]!.trigger('keydown', { key: ' ' })
    await dots[0]!.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:page')).toBeUndefined()
    expect(dots[0]!.attributes('aria-current')).toBe('page')
    expect(dots.map(dot => dot.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Pagination from './Pagination.vue'

// 主题把控件连成一条时，要靠这两个属性认出这一排的两头。
function ends(props: Record<string, unknown>): [string | undefined, string | undefined] {
  const wrapper = mount(Pagination, { props: { page: 2, pageSize: 10, total: 100, ...props } })
  const first = wrapper.findAll('[data-first="first"]')
  const last = wrapper.findAll('[data-last="last"]')
  expect(first).toHaveLength(1)
  expect(last).toHaveLength(1)
  const named = (classes: string[]) => classes.find(name => name !== 'astryx-pagination-button' && name !== 'astryx-pagination-item')
  return [named(first[0]!.classes()), named(last[0]!.classes())]
}

describe('pagination 这一排控件的两头', () => {
  it('有首页和末页按钮时落在它们上面', () => {
    expect(ends({ variant: 'input' })).toEqual(['astryx-pagination-first', 'astryx-pagination-last'])
  })

  it('没有首页和末页按钮时落在上一页和下一页上', () => {
    expect(ends({ variant: 'pages' })).toEqual(['astryx-pagination-prev', 'astryx-pagination-next'])
  })
})

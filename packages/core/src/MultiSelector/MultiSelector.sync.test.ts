import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MultiSelector from './MultiSelector.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

async function open(wrapper: ReturnType<typeof mount>): Promise<void> {
  await wrapper.get('button.astryx-multi-selector-trigger').trigger('click')
  await nextTick()
}

describe('multiSelector 缺少 options', () => {
  it('没传 options 时开发期报错，点名组件、属性和改法', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(MultiSelector, { props: { label: 'Fruit' } as never })).toThrowError(/MultiSelector: `options` must be an array.*does not read <option> children/)
    error.mockRestore()
    warn.mockRestore()
  })
})

describe('multiSelector 的主题状态和搜索框提示', () => {
  it('选项带 highlighted、selected、disabled 状态属性', async () => {
    const wrapper = mount(MultiSelector, {
      attachTo: document.body,
      props: { label: 'Fruit', modelValue: ['cherry'], options: [fruits[0]!, { ...fruits[1]!, disabled: true }, fruits[2]!] },
    })
    await open(wrapper)
    const trigger = wrapper.get('button.astryx-multi-selector-trigger').element
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    const rows = [...document.querySelectorAll('.astryx-multi-selector-option')]
    expect(rows[2]!.getAttribute('data-selected')).toBe('selected')
    expect(rows[1]!.getAttribute('data-disabled')).toBe('disabled')
    expect(rows.filter(row => row.getAttribute('data-highlighted') === 'highlighted')).toHaveLength(1)
    wrapper.unmount()
  })

  it('搜索框请求 Search 键，且不自动纠正', async () => {
    const wrapper = mount(MultiSelector, { attachTo: document.body, props: { label: 'Fruit', options: fruits, searchable: true } })
    await open(wrapper)
    const search = document.querySelector('.astryx-multi-selector-search input')!
    expect(search.getAttribute('enterkeyhint')).toBe('search')
    expect(search.getAttribute('autocorrect')).toBe('off')
    wrapper.unmount()
  })

  it('输入新查询后高亮落到新列表的第一项，不留在旧下标上', async () => {
    const wrapper = mount(MultiSelector, { attachTo: document.body, props: { label: 'Fruit', options: fruits, searchable: true } })
    await open(wrapper)
    const search = document.querySelector<HTMLInputElement>('.astryx-multi-selector-search input')!
    search.focus()
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    search.value = 'ch'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    const lit = [...document.querySelectorAll('.astryx-multi-selector-option[data-highlighted="highlighted"]')]
    expect(lit.map(row => row.textContent?.trim())).toEqual(['Cherry'])
    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Selector from './Selector.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

async function open(wrapper: ReturnType<typeof mount>): Promise<HTMLButtonElement> {
  const trigger = wrapper.get('button.astryx-selector-trigger')
  await trigger.trigger('click')
  await nextTick()
  return trigger.element as HTMLButtonElement
}

function activeOption(): string | null {
  return document.querySelector('.astryx-selector-option.is-active')?.textContent?.trim() ?? null
}

describe('selector 禁用后的列表', () => {
  it('列表开着时字段被禁用，点选项不改值', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    await open(wrapper)
    await wrapper.setProps({ disabled: true })
    document.querySelectorAll<HTMLElement>('.astryx-selector-option')[1]!.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('列表开着时字段变只读，回车也不改值', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    const trigger = await open(wrapper)
    await wrapper.setProps({ isReadOnly: true })
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('selector 选中后的焦点', () => {
  it('点选项选中后，焦点回到触发器', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    const trigger = await open(wrapper)
    const option = document.querySelectorAll<HTMLElement>('.astryx-selector-option')[1]!
    option.focus()
    option.click()
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(document.activeElement).toBe(trigger)
  })

  it('搜索框里回车选中后，焦点回到触发器', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits, searchable: true } })
    const trigger = await open(wrapper)
    const search = document.querySelector<HTMLInputElement>('.astryx-selector-search-input')!
    search.focus()
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
    expect(document.activeElement).toBe(trigger)
  })
})

describe('selector 高亮', () => {
  it('选项换了，高亮跟着原来那个选项走', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    const trigger = await open(wrapper)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(activeOption()).toBe('Banana')
    await wrapper.setProps({ options: [{ value: 'date', label: 'Date' }, ...fruits] })
    await nextTick()
    expect(activeOption()).toBe('Banana')
  })

  it('高亮的选项被去掉，落到后面第一个可用选项', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    const trigger = await open(wrapper)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    await wrapper.setProps({ options: [fruits[0]!, fruits[2]!] })
    await nextTick()
    expect(activeOption()).toBe('Cherry')
  })

  it('选项换了但值都没变，高亮不动', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    const trigger = await open(wrapper)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    await wrapper.setProps({ options: fruits.map(option => ({ ...option })) })
    await nextTick()
    expect(activeOption()).toBe('Banana')
  })

  it('搜索词变了，旧高亮不留在新列表的随机一行', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits, searchable: true } })
    await open(wrapper)
    const search = document.querySelector<HTMLInputElement>('.astryx-selector-search-input')!
    search.value = 'an'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(activeOption()).toBe('Banana')
    search.value = ''
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(activeOption()).not.toBe('Banana')
  })
})

describe('selector 缺少 options', () => {
  it('没传 options 时开发期报错，点名组件、属性和改法', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(Selector, { props: { label: 'Fruit' } as never })).toThrowError(/Selector: `options` must be an array.*does not read <option> children/)
    error.mockRestore()
    warn.mockRestore()
  })
})

describe('selector 的主题状态', () => {
  it('选项带 highlighted、selected、disabled 状态属性', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', modelValue: 'cherry', options: [fruits[0]!, { ...fruits[1]!, disabled: true }, fruits[2]!] },
    })
    await open(wrapper)
    const rows = [...document.querySelectorAll('.astryx-selector-option')]
    expect(rows[2]!.getAttribute('data-selected')).toBe('selected')
    expect(rows[2]!.getAttribute('data-highlighted')).toBe('highlighted')
    expect(rows[1]!.getAttribute('data-disabled')).toBe('disabled')
    expect(rows[0]!.getAttribute('data-highlighted')).toBeNull()
    expect(rows[0]!.getAttribute('data-selected')).toBeNull()
  })
})

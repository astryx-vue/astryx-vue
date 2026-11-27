import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PickerWheel from './PickerWheel.vue'

const options = Array.from({ length: 30 }, (_, index) => ({ value: String(index), label: String(index), disabled: index === 3 }))

function press(key: string, modelValue: string): string[][] | undefined {
  const wrapper = mount(PickerWheel, { props: { label: 'Day', options, modelValue } })
  void wrapper.get('[role="listbox"]').trigger('keydown', { key })
  return wrapper.emitted<string[]>('update:modelValue')
}

describe('pickerWheel 的行', () => {
  it('每行的文字包在自己的元素里：渐隐的倾倒画在它上面，行本身保持不动', () => {
    const wrapper = mount(PickerWheel, { props: { label: 'Day', options, modelValue: '2' } })
    const rows = wrapper.findAll('[role="option"]')
    expect(rows).toHaveLength(30)
    expect(rows[2]!.get('.astryx-picker-wheel-option-label').text()).toBe('2')
    expect(rows[2]!.element.children).toHaveLength(1)
    expect(rows[3]!.attributes('aria-disabled')).toBe('true')
  })
})

describe('pickerWheel 的按键', () => {
  it('方向键在可选的行之间走一行，跳过不可选的行', () => {
    expect(press('ArrowDown', '2')).toEqual([['4']])
    expect(press('ArrowUp', '4')).toEqual([['2']])
  })

  it('走到头就停在头上，不绕回另一头', () => {
    expect(press('ArrowDown', '29')).toBeUndefined()
    expect(press('ArrowUp', '0')).toBeUndefined()
  })

  it('page 键走十行，走不满就停在头上', () => {
    expect(press('PageDown', '0')).toEqual([['11']])
    expect(press('PageUp', '11')).toEqual([['0']])
    expect(press('PageDown', '25')).toEqual([['29']])
  })

  it('home 和 End 到两头', () => {
    expect(press('Home', '12')).toEqual([['0']])
    expect(press('End', '12')).toEqual([['29']])
  })
})

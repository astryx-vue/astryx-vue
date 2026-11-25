import { beforeEach, describe, expect, it } from 'vitest'
import { PRESS_ACTION_ATTRIBUTE, PRESS_CONTAINER_ATTRIBUTE, PRESSABLE_ATTRIBUTE, pressSurfaceAt } from './pressSurface.js'

function el(tag: string, parent: Element, attributes: Record<string, string> = {}): HTMLElement {
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(attributes))
    element.setAttribute(name, value)
  parent.appendChild(element)
  return element
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('可按容器里按在别的控件上，容器不亮', () => {
  it('落在容器里另一个按钮上：没有可画的元素', () => {
    const row = el('li', document.body, { [PRESSABLE_ATTRIBUTE]: '', [PRESS_CONTAINER_ATTRIBUTE]: '' })
    const nested = el('button', row)
    const icon = el('span', nested)
    expect(pressSurfaceAt(icon)).toBeNull()
  })

  it('落在容器自己的动作元素上：容器亮', () => {
    const row = el('li', document.body, { [PRESSABLE_ATTRIBUTE]: '', [PRESS_CONTAINER_ATTRIBUTE]: '' })
    const action = el('a', row, { href: '#', [PRESS_ACTION_ATTRIBUTE]: '' })
    const label = el('span', action)
    expect(pressSurfaceAt(label)).toBe(row)
  })

  it('落在容器表面的文字上：容器亮', () => {
    const row = el('li', document.body, { [PRESSABLE_ATTRIBUTE]: '', [PRESS_CONTAINER_ATTRIBUTE]: '' })
    const text = el('span', row)
    expect(pressSurfaceAt(text)).toBe(row)
    expect(pressSurfaceAt(row)).toBe(row)
  })

  it('只读的控件不算别的控件', () => {
    const row = el('li', document.body, { [PRESSABLE_ATTRIBUTE]: '', [PRESS_CONTAINER_ATTRIBUTE]: '' })
    const readonly = el('span', row, { 'role': 'checkbox', 'aria-readonly': 'true' })
    expect(pressSurfaceAt(readonly)).toBe(row)
  })

  it('不是容器的可按元素照旧：自己里面的控件就是它的动作', () => {
    const switchRow = el('label', document.body, { [PRESSABLE_ATTRIBUTE]: '' })
    const input = el('input', switchRow, { type: 'checkbox' })
    expect(pressSurfaceAt(input)).toBe(switchRow)
  })

  it('里面的控件自己可按时，它接走这次按压', () => {
    const row = el('li', document.body, { [PRESSABLE_ATTRIBUTE]: '', [PRESS_CONTAINER_ATTRIBUTE]: '' })
    const button = el('button', row, { [PRESSABLE_ATTRIBUTE]: '' })
    expect(pressSurfaceAt(button)).toBe(button)
  })
})

import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ClickableCard from '../ClickableCard/ClickableCard.vue'
import Item from '../List/Item.vue'
import SelectableCard from '../SelectableCard/SelectableCard.vue'
import Token from '../Token/Token.vue'
import TreeList from '../TreeList/TreeList.vue'
import { PRESSED_ATTRIBUTE, resetPressFeedbackForTest } from './internal/pressFeedback.js'

/** 手指按下。这些组件都不在滚动容器里，按压在落下那一帧就画。 */
function touchDown(element: Element): void {
  const event = new Event('pointerdown', { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: 5, clientY: 5, pointerId: 1, pointerType: 'touch' })
  element.dispatchEvent(event)
}

function touchUp(element: Element): void {
  const event = new Event('pointerup', { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: 5, clientY: 5, pointerId: 1, pointerType: 'touch' })
  element.dispatchEvent(event)
}

const pressed = (element: Element): string | null => element.getAttribute(PRESSED_ATTRIBUTE)

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  resetPressFeedbackForTest()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('手指按在容器里别的控件上，容器不亮', () => {
  it('列表行：按行尾的按钮不亮，按行本身照亮', () => {
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: { label: 'Row', onClick: () => undefined },
      slots: { endContent: () => h('button', { type: 'button', class: 'nested' }, 'More') },
    })
    const row = wrapper.element as HTMLElement
    touchDown(wrapper.get('.nested').element)
    expect(pressed(row)).toBeNull()
    touchUp(row)
    touchDown(wrapper.get('.astryx-item__label').element)
    expect(pressed(row)).toBe('on')
    wrapper.unmount()
  })

  it('列表行：转发点击的行，按被转发的控件照亮', () => {
    const control = document.createElement('input')
    control.type = 'checkbox'
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: { label: 'Row', interactiveRef: control },
      slots: { startContent: () => h('span', { class: 'host' }) },
    })
    wrapper.get('.host').element.appendChild(control)
    touchDown(control)
    expect(pressed(wrapper.element as HTMLElement)).toBe('on')
    wrapper.unmount()
  })

  it('树形列表的行：按行尾按钮不亮；整行是展开收起时，按箭头照亮', () => {
    const wrapper = mount(TreeList, {
      attachTo: document.body,
      props: {
        items: [
          { id: 'run', label: 'Run', onClick: () => undefined, endContent: () => h('button', { type: 'button', class: 'nested' }, 'x') },
          { id: 'folder', label: 'Folder', children: [{ id: 'child', label: 'Child' }] },
        ],
      },
    })
    const [runRow, folderRow] = wrapper.findAll('.astryx-tree-list__content').map(row => row.element)
    touchDown(wrapper.get('.nested').element)
    expect(pressed(runRow!)).toBeNull()
    touchUp(runRow!)
    touchDown(wrapper.get('[data-tree-toggle]').element)
    expect(pressed(folderRow!)).toBe('on')
    wrapper.unmount()
  })

  it('标签：按删除按钮不亮，按标签本身照亮', () => {
    const wrapper = mount(Token, {
      attachTo: document.body,
      props: { label: 'Tag', removable: true, onClick: () => undefined },
    })
    const token = wrapper.element as HTMLElement
    touchDown(wrapper.get('.astryx-token-remove').element)
    expect(pressed(token)).toBeNull()
    touchUp(token)
    touchDown(wrapper.get('.astryx-token-label').element)
    expect(pressed(token)).toBe('on')
    wrapper.unmount()
  })

  it('可点卡片和可选卡片：按卡片里的输入框不亮，按卡片表面照亮', () => {
    for (const component of [ClickableCard, SelectableCard]) {
      const wrapper = mount(component as typeof ClickableCard, {
        attachTo: document.body,
        props: { label: 'Card' },
        slots: { default: () => [h('p', { class: 'text' }, 'Body'), h('input', { class: 'nested' })] },
      })
      const card = wrapper.element as HTMLElement
      touchDown(wrapper.get('.nested').element)
      expect(pressed(card)).toBeNull()
      touchUp(card)
      touchDown(wrapper.get('.text').element)
      expect(pressed(card)).toBe('on')
      touchUp(card)
      wrapper.unmount()
    }
  })
})

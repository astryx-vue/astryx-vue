import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TreeList from './TreeList.vue'

describe('tree list 禁用内部控件', () => {
  it('展开、动作和链接保留焦点，但点击和键盘都不能触发行为', () => {
    const onClick = vi.fn()
    const wrapper = mount(TreeList, {
      attachTo: document.body,
      props: {
        items: [
          { id: 'folder', label: 'Folder', isDisabled: true, isExpanded: true, children: [{ id: 'child', label: 'Child' }] },
          { id: 'run', label: 'Run', isDisabled: true, onClick },
          { id: 'docs', label: 'Docs', isDisabled: true, href: 'https://example.com' },
        ],
      },
    })

    expect(wrapper.find('[disabled]').exists()).toBe(false)
    const toggle = wrapper.get<HTMLButtonElement>('[data-tree-toggle]')
    expect(toggle.attributes('aria-disabled')).toBe('true')
    ;(toggle.element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(toggle.element)
    ;(toggle.element as HTMLButtonElement).click()
    expect(wrapper.get('[data-tree-id="folder"]').attributes('aria-expanded')).toBe('true')

    const action = wrapper.get<HTMLButtonElement>('button.astryx-tree-list__action')
    expect(action.attributes('aria-disabled')).toBe('true')
    ;(action.element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(action.element)
    ;(action.element as HTMLButtonElement).click()
    action.trigger('keydown', { key: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()

    const link = wrapper.get<HTMLAnchorElement>('a.astryx-tree-list__action')
    expect(link.attributes('aria-disabled')).toBe('true')
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    wrapper.unmount()
  })
})

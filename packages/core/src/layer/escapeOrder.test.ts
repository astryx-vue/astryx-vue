import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Dialog from '../Dialog/Dialog.vue'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import HoverCard from '../HoverCard/HoverCard.vue'
import Popover from '../Popover/Popover.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { resetDismissStackForTests } from './dismissStack.js'

enableAutoUnmount(afterEach)

beforeAll(ensureDialogModalApi)

afterEach(() => {
  resetDismissStackForTests()
  document.body.innerHTML = ''
})

function isShown(element: HTMLElement): boolean {
  return element.style.display !== 'none'
}

function pressEscape(): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
  document.dispatchEvent(event)
  // 浏览器在按键没被吃掉时，会接着给原生 dialog 派发 cancel。测试里补上这一步，
  // 这样栈忘了 preventDefault 时 Dialog 会一起关掉，用例才会失败。
  if (!event.defaultPrevented) {
    document.querySelector('dialog')?.dispatchEvent(new Event('cancel', { cancelable: true }))
  }
  return event
}

describe('escape 只打最上面一层', () => {
  it('dialog 里的 Tooltip 吃掉一次 Escape，Dialog 保持打开', async () => {
    const dialog = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: true },
      slots: {
        default: () => h(Tooltip, { content: 'Hint', isDefaultOpen: true }, {
          default: () => h('button', { type: 'button' }, 'Trigger'),
        }),
      },
    })
    await flushPromises()
    await nextTick()

    const bubble = document.querySelector('[role="tooltip"]') as HTMLElement
    expect(isShown(bubble)).toBe(true)

    const event = pressEscape()
    await nextTick()

    expect(event.defaultPrevented).toBe(true)
    expect(isShown(bubble)).toBe(false)
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    expect(dialog.emitted('openChange')).toBeUndefined()
  })

  it('dialog 里的 HoverCard 吃掉一次 Escape，Dialog 保持打开', async () => {
    const dialog = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: true },
      slots: {
        default: () => h(HoverCard, { content: 'Details', isDefaultOpen: true }, {
          default: () => h('button', { type: 'button' }, 'Trigger'),
        }),
      },
    })
    await flushPromises()
    await nextTick()

    const surface = document.querySelector('.astryx-hover-card') as HTMLElement
    expect(isShown(surface)).toBe(true)

    const event = pressEscape()
    await nextTick()

    expect(event.defaultPrevented).toBe(true)
    expect(isShown(surface)).toBe(false)
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    expect(dialog.emitted('openChange')).toBeUndefined()
  })

  it('不响应 Escape 的 Popover 盖在菜单上时，Escape 不关菜单', async () => {
    const menu = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'Edit project' }] },
    })
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
    trigger.click()
    await flushPromises()
    const menuSurface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
    expect(isShown(menuSurface)).toBe(true)

    const popover = mount(Popover, {
      attachTo: document.body,
      props: { label: 'Options', hasEscapeDismiss: false },
      slots: {
        default: '<button type="button">Open</button>',
        content: '<p>Body</p>',
      },
    })
    await popover.setProps({ isOpen: true })
    await flushPromises()
    const popoverSurface = document.querySelector<HTMLElement>('.astryx-popover')!
    expect(isShown(popoverSurface)).toBe(true)

    const event = pressEscape()
    await flushPromises()

    expect(event.defaultPrevented).toBe(true)
    expect(isShown(menuSurface)).toBe(true)
    expect(isShown(popoverSurface)).toBe(true)
    expect(menu.emitted('openChange')).toEqual([[true]])
  })
})

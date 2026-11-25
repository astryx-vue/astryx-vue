import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import AlertDialog from '../AlertDialog/AlertDialog.vue'
import Button from '../Button/Button.vue'
import { PRESS_GROUP_ITEM_ATTRIBUTE } from '../composables/internal/useActionGroupTracking.js'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import ToggleButtonGroup from '../ToggleButton/ToggleButtonGroup.vue'
import ButtonGroup from './ButtonGroup.vue'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

/** 主要指针是不是粗指针。窄屏查询一律不匹配，提示对话框按横排布局。 */
function stubCoarsePointer(coarse: boolean): void {
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: coarse && query.includes('pointer: coarse') && !query.includes('width'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })))
}

function touch(target: Element, type: string): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: 5, clientY: 5, button: 0, pointerId: 1, pointerType: 'touch', isPrimary: true })
  target.dispatchEvent(event)
}

function placeAt(element: Element, left: number): void {
  element.getBoundingClientRect = () => ({ left, right: left + 100, top: 0, bottom: 40, width: 100, height: 40, x: left, y: 0, toJSON: () => ({}) })
}

/** 手指按在 `from` 上，滑到 `to`，在那里松手。 */
function slide(from: Element, to: Element): void {
  placeAt(from, 0)
  placeAt(to, 200)
  touch(from, 'pointerdown')
  const move = new Event('pointermove', { bubbles: true })
  Object.assign(move, { clientX: 250, clientY: 5, pointerId: 1, pointerType: 'touch' })
  from.dispatchEvent(move)
  const up = new Event('pointerup', { bubbles: true })
  Object.assign(up, { clientX: 250, clientY: 5, pointerId: 1, pointerType: 'touch' })
  from.dispatchEvent(up)
}

describe('按钮组在触屏设备上跟踪手指滑动', () => {
  it('滑到另一个按钮上松手，只执行那一个；菜单触发器不归组跟踪', async () => {
    stubCoarsePointer(true)
    const ran: string[] = []
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      props: { label: 'Actions' },
      slots: {
        default: () => [
          h(Button, { label: 'Copy', class: 'copy', onClick: () => ran.push('copy') }),
          h(Button, { label: 'Paste', class: 'paste', onClick: () => ran.push('paste') }),
          h(Button, { 'label': 'More', 'class': 'more', 'aria-haspopup': 'menu' }),
        ],
      },
    })
    await nextTick()
    expect(wrapper.attributes('data-press-tracking')).toBe('true')
    expect(wrapper.get('.more').attributes(PRESS_GROUP_ITEM_ATTRIBUTE)).toBeUndefined()
    slide(wrapper.get('.copy').element, wrapper.get('.paste').element)
    await flushPromises()
    expect(ran).toEqual(['paste'])
  })

  it('鼠标为主的设备上不跟踪，按钮不带组标记', async () => {
    stubCoarsePointer(false)
    const wrapper = mount(ButtonGroup, {
      attachTo: document.body,
      props: { label: 'Actions' },
      slots: { default: () => [h(Button, { label: 'Copy', class: 'copy' })] },
    })
    await nextTick()
    expect(wrapper.attributes('data-press-tracking')).toBeUndefined()
    expect(wrapper.get('.copy').attributes(PRESS_GROUP_ITEM_ATTRIBUTE)).toBeUndefined()
  })
})

describe('切换按钮组在触屏设备上跟踪手指滑动', () => {
  it('只切换松手时手指下的那个', async () => {
    stubCoarsePointer(true)
    const value = ref<string[]>([])
    const wrapper = mount(ToggleButtonGroup, {
      attachTo: document.body,
      props: { 'label': 'Format', 'type': 'multiple', 'value': value.value, 'onUpdate:value': (next: unknown) => {
        value.value = next as string[]
      } },
      slots: {
        default: () => [
          h(ToggleButton, { label: 'Bold', value: 'bold', class: 'bold' }),
          h(ToggleButton, { label: 'Italic', value: 'italic', class: 'italic' }),
          h(ToggleButton, { label: 'Loose', class: 'loose' }),
        ],
      },
    })
    await nextTick()
    expect(wrapper.get('.loose').attributes(PRESS_GROUP_ITEM_ATTRIBUTE)).toBeUndefined()
    slide(wrapper.get('.bold').element, wrapper.get('.italic').element)
    await flushPromises()
    expect(value.value).toEqual(['italic'])
  })
})

describe('提示对话框的两个按钮在触屏设备上跟踪手指滑动', () => {
  it('从取消滑到确认上松手，执行确认', async () => {
    stubCoarsePointer(true)
    const onAction = vi.fn()
    const onOpenChange = vi.fn()
    const wrapper = mount(AlertDialog, {
      attachTo: document.body,
      props: { isOpen: true, title: 'Delete?', description: 'Gone for good.', actionLabel: 'Delete', onAction, onOpenChange },
    })
    await flushPromises()
    const cancel = document.querySelector('.astryx-alert-dialog__action--cancel')!
    const confirm = document.querySelector('.astryx-alert-dialog__action--confirm')!
    expect(cancel.getAttribute(PRESS_GROUP_ITEM_ATTRIBUTE)).toBe('touch pen')
    slide(cancel, confirm)
    await flushPromises()
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onOpenChange).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

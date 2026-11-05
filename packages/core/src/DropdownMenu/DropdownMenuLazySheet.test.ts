import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DropdownMenu from './DropdownMenu.vue'

const sheetLoad = vi.hoisted(() => {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  return { gate, release: () => release(), requests: 0 }
})

vi.mock('../BottomSheet/BottomSheet.vue', async (importOriginal) => {
  sheetLoad.requests += 1
  await sheetLoad.gate
  return importOriginal()
})

enableAutoUnmount(afterEach)

beforeEach(() => {
  document.body.innerHTML = ''
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  })
})

describe('dropdownMenu 底部面板按需加载', () => {
  it('普通 popover 菜单从渲染到打开都不请求 BottomSheet', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { button: { label: 'Actions' }, items: [{ label: 'Edit' }] },
    })
    document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > button')!.click()
    await flushPromises()

    expect(sheetLoad.requests).toBe(0)
  })

  it('键盘打开早于下载完成时，面板到达后聚焦第一行', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { button: { label: 'Actions' }, presentation: 'bottom-sheet', items: [{ label: 'Edit' }] },
    })
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > button')!
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await flushPromises()

    expect(sheetLoad.requests).toBe(1)
    expect(document.body.textContent).not.toContain('Edit')

    sheetLoad.release()
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Edit')
    })
    await nextTick()
    await flushPromises()
    const row = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')]
      .find(item => item.textContent?.includes('Edit'))
    expect(row).not.toBeUndefined()
    expect(document.activeElement).toBe(row)
  })
})

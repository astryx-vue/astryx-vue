import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Drawer from './Drawer.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

// 测试环境不加载样式表：用行内样式给面板一段 transform 过渡，退场才有东西可等。
const SLIDE = 'transition-property: transform; transition-duration: 200ms'

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog.astryx-drawer') as HTMLDialogElement
}

function endSlide(dialog: HTMLElement): void {
  const event = new Event('transitionend') as TransitionEvent
  Object.defineProperty(event, 'propertyName', { value: 'transform' })
  dialog.dispatchEvent(event)
}

describe('drawer exit', () => {
  it('stays in its host and keeps painting until the slide-out ends, then returns focus', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Details' },
      attrs: { style: SLIDE },
      slots: { default: () => h('button', { 'data-autofocus': '' }, 'Inside') },
    })
    await nextTick()
    const dialog = dialogEl()
    expect(dialog.hasAttribute('data-open')).toBe(true)
    expect(document.activeElement?.textContent).toBe('Inside')

    await wrapper.setProps({ isOpen: false })
    await nextTick()
    // 退场中：已经指向关闭位置，但还在宿主里、还在画。
    expect(dialog.hasAttribute('data-open')).toBe(false)
    expect(dialog.hasAttribute('data-rendered')).toBe(true)
    expect(dialog.open).toBe(true)

    endSlide(dialog)
    await nextTick()
    expect(dialog.open).toBe(false)
    expect(dialog.hasAttribute('data-rendered')).toBe(false)
    expect(document.activeElement).toBe(opener)
  })

  it('slides out to the side it opened from when placement changes as it closes', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Details', placement: 'start' },
      attrs: { style: SLIDE },
    })
    await nextTick()
    const dialog = dialogEl()
    expect(dialog.dataset.side).toBe('start')

    // 调用方从同一份选中数据算出这两个值：一关闭，placement 就回到默认值。
    await wrapper.setProps({ isOpen: false, placement: 'end' })
    await nextTick()
    expect(dialog.dataset.side).toBe('start')
    expect(dialog.classList.contains('astryx-drawer--start')).toBe(true)

    endSlide(dialog)
    await nextTick()
    expect(dialog.dataset.side).toBe('start')

    // 下一次打开贴到新的一边。
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    expect(dialog.dataset.side).toBe('end')
  })

  it('reopening mid-exit cancels the exit and keeps the host open', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Details' },
      attrs: { style: SLIDE },
    })
    await nextTick()
    const dialog = dialogEl()
    await wrapper.setProps({ isOpen: false })
    await nextTick()
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    endSlide(dialog)
    await nextTick()
    expect(dialog.open).toBe(true)
    expect(dialog.hasAttribute('data-rendered')).toBe(true)
    expect(dialog.hasAttribute('data-open')).toBe(true)
  })
})

describe('drawer motion styles', () => {
  const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/drawer.css'), 'utf8')
  const panelRule = css.match(/\n {2}\.astryx-drawer \{[^}]*\}/)?.[0] ?? ''

  it('slides with the theme duration and easing', () => {
    expect(panelRule).toContain('--_drawer-duration: var(--astryx-duration-medium')
    expect(panelRule).toContain('--_drawer-easing: var(--astryx-ease-standard')
    expect(panelRule).toContain('transition: transform var(--_drawer-duration) var(--_drawer-easing)')
  })

  it('collapses the slide and the scrim fade to 0.01s under reduced motion, so the exit still ends', () => {
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reduced).toMatch(/\.astryx-drawer \{\s*transition-duration: 0\.01s;/)
    expect(reduced).toMatch(/\.astryx-drawer--scrim::backdrop \{\s*transition-duration: 0\.01s;/)
  })

  it('clips the panel without making it a scroll container, so the page beside it scrolls under a finger', () => {
    expect(panelRule).toContain('overflow: clip;')
    expect(panelRule).not.toMatch(/overflow: (hidden|auto|scroll)/)
    expect(css).toMatch(/\.astryx-drawer__content \{[^}]*overflow-y: auto;[^}]*overscroll-behavior: contain;/)
  })
})

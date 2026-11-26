import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
/**
 * @file MobileNavDrawer.test.ts
 * @input vitest (jsdom)、MobileNav 抽屉
 * @output 抽屉最宽不超过视口的 85%、头部随内容长高；从里面冒上来的 cancel 不关抽屉；
 *   内容区是和对话框同名的导航地标；`side="auto"` 按文字方向和打开者位置选边，
 *   没有焦点时找 aria-controls 指向抽屉的元素
 */
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { resetScrollLockForTest } from '../composables/internal/scrollLock.js'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import MobileNav from './MobileNav.vue'

afterEach(() => {
  resetScrollLockForTest()
  resetDismissStackForTests()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/mobile-nav.css'), 'utf8')

describe('mobile-nav drawer styles', () => {
  it('caps the drawer at 85vw so a strip of backdrop stays tappable', () => {
    const drawer = /\.astryx-mobile-nav__drawer \{[^}]*\}/.exec(css)?.[0] ?? ''
    expect(drawer).toContain('width: min(var(--astryx-mobile-nav-width, 320px), 85vw)')
  })

  it('lets the header row grow with taller header content', () => {
    const header = /\.astryx-mobile-nav__header \{[^}]*\}/.exec(css)?.[0] ?? ''
    expect(header).toContain('min-height: 48px')
    expect(header).not.toMatch(/[^-]height: 48px/)
  })
})

describe('mobile-nav cancel', () => {
  it('ignores a cancel that bubbles up from inside, like a dismissed file picker', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Navigation', onOpenChange },
      slots: { default: () => h('input', { 'type': 'file', 'aria-label': 'Upload' }) },
    })
    await nextTick()
    const input = document.body.querySelector('input')!
    const event = new Event('cancel', { bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()

    const own = new Event('cancel', { cancelable: true })
    document.body.querySelector('dialog')!.dispatchEvent(own)
    expect(own.defaultPrevented).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    wrapper.unmount()
  })
})

describe('mobile-nav landmark', () => {
  it('puts the drawer content in a navigation landmark named like the dialog', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { header: 'My Nav', isOpen: true },
      slots: { default: () => h('a', { href: '/home' }, 'Home') },
    })
    await nextTick()
    const dialog = document.body.querySelector('dialog')!
    const navs = dialog.querySelectorAll('nav')
    expect(navs).toHaveLength(1)
    const labelledBy = navs[0]!.getAttribute('aria-labelledby')
    expect(dialog.querySelector(`#${CSS.escape(labelledBy ?? '')}`)?.textContent).toContain('My Nav')
    expect(navs[0]!.getAttribute('aria-label')).toBe('My Nav')
    expect(navs[0]!.contains(dialog.querySelector('a'))).toBe(true)
    wrapper.unmount()
  })

  it('falls back to the localized default name without a title', async () => {
    const wrapper = mount(MobileNav, { attachTo: document.body, props: { isOpen: true } })
    await nextTick()
    const nav = document.body.querySelector('dialog nav')!
    expect(nav.getAttribute('aria-labelledby')).toBeNull()
    expect(nav.getAttribute('aria-label')).toBe('Navigation')
    wrapper.unmount()
  })

  it('follows the caller aria-labelledby', async () => {
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      attrs: { 'aria-labelledby': 'drawer-title' },
      props: { isOpen: true },
    })
    await nextTick()
    expect(document.body.querySelector('dialog nav')!.getAttribute('aria-labelledby')).toBe('drawer-title')
    wrapper.unmount()
  })
})

describe('mobile-nav side="auto"', () => {
  function openFrom(
    opener: HTMLElement,
    options: { direction?: 'ltr' | 'rtl', left: number, width?: number, focus?: boolean },
  ) {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 })
    vi.spyOn(opener, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ x: options.left, y: 0, width: options.width ?? 40, height: 40 }),
    )
    opener.style.direction = options.direction ?? 'ltr'
    if (options.focus ?? true)
      opener.focus()
  }

  async function sideFor(setup: (opener: HTMLElement, wrapperId: string) => void): Promise<string | undefined> {
    const opener = document.createElement('button')
    document.body.append(opener)
    setup(opener, 'drawer')
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { id: 'drawer', isOpen: false, label: 'Navigation' },
    })
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    const classes = document.body.querySelector('dialog')!.className
    wrapper.unmount()
    return /astryx-mobile-nav--(start|end)/.exec(classes)?.[1]
  }

  it('opens from the inline-start edge for an opener in the inline-start half, in LTR', async () => {
    expect(await sideFor(opener => openFrom(opener, { left: 10 }))).toBe('start')
    expect(await sideFor(opener => openFrom(opener, { left: 340 }))).toBe('end')
  })

  it('mirrors in RTL: an opener on the right is at the inline start', async () => {
    expect(await sideFor(opener => openFrom(opener, { direction: 'rtl', left: 340 }))).toBe('start')
    expect(await sideFor(opener => openFrom(opener, { direction: 'rtl', left: 10 }))).toBe('end')
  })

  it('opens a centred opener at the inline end in both directions', async () => {
    expect(await sideFor(opener => openFrom(opener, { left: 180 }))).toBe('end')
    expect(await sideFor(opener => openFrom(opener, { direction: 'rtl', left: 180 }))).toBe('end')
  })

  it('finds the element that controls the drawer when nothing has focus', async () => {
    const side = await sideFor((opener, id) => {
      opener.setAttribute('aria-controls', id)
      openFrom(opener, { focus: false, left: 10 })
    })
    expect(side).toBe('start')
  })

  it('uses the inline end when no opener is found', async () => {
    expect(await sideFor(() => {})).toBe('end')
  })
})

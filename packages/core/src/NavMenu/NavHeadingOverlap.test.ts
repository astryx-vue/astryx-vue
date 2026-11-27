import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import SideNavHeading from '../SideNav/SideNavHeading.vue'
import TopNavHeading from '../TopNav/TopNavHeading.vue'
import NavHeadingMenu from './NavHeadingMenu.vue'
import NavHeadingMenuItem from './NavHeadingMenuItem.vue'

const ANCHOR = { top: 20, left: 40, width: 180, height: 32 }

function stubAnchorRect(): void {
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (!this.classList.contains('astryx-nav-disclosure'))
      return original.call(this)
    const { top, left, width, height } = ANCHOR
    return { top, left, width, height, bottom: top + height, right: left + width, x: left, y: top, toJSON: () => ({}) } as DOMRect
  })
}

function mountHeading(component: Component) {
  return mount(component, {
    attachTo: document.body,
    props: { heading: 'Acme' },
    slots: {
      icon: () => h('span', { class: 'astryx-nav-icon' }),
      menu: () => h(NavHeadingMenu, () => [
        h(NavHeadingMenuItem, { href: '/dashboard', label: 'Dashboard' }),
        h(NavHeadingMenuItem, { href: '/settings', label: 'Settings' }),
      ]),
    },
  })
}

async function settle(): Promise<void> {
  await nextTick()
  await nextTick()
  await nextTick()
}

function panel(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.astryx-nav-disclosure__panel')
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe.each([
  ['SideNavHeading', SideNavHeading, 'astryx-side-nav-heading'],
  ['TopNavHeading', TopNavHeading, 'astryx-top-nav-heading'],
] as const)('%s menu', (_name, component, block) => {
  it('opens over the heading, with the heading as the panel\'s first row', async () => {
    stubAnchorRect()
    const wrapper = mountHeading(component)

    await wrapper.get('button[aria-haspopup="menu"]').trigger('click')
    await settle()

    const surface = panel()
    expect(surface).not.toBeNull()
    expect(surface!.classList).toContain('astryx-nav-disclosure__panel--overlap')
    // 左上各外扩 8px，宽度比标题多 16px：面板里的标题行和原来的标题重合，而不是出现在它下面。
    expect(surface!.style.top).toBe('12px')
    expect(surface!.style.left).toBe('32px')
    expect(surface!.style.minWidth).toBe('196px')

    const [first, second] = Array.from(surface!.children)
    expect(first.classList).toContain(`${block}--echo`)
    expect(first.textContent).toContain('Acme')
    expect(first.querySelector(`.${block}__chevron-icon--open`)).not.toBeNull()
    expect(second.querySelectorAll('[role="menuitem"]')).toHaveLength(2)

    await (first as HTMLElement).click()
    await settle()
    expect(panel()).toBeNull()
    wrapper.unmount()
  })

  it('opens on hover without a delay', async () => {
    vi.useFakeTimers()
    const wrapper = mountHeading(component)

    await wrapper.get('.astryx-nav-disclosure').trigger('pointerenter')
    vi.advanceTimersByTime(0)
    await settle()

    expect(panel()).not.toBeNull()
    wrapper.unmount()
  })
})

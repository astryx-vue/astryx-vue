import { Dialog } from '@astryx-vue/core'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import DialogHeroHeader from './DialogHeroHeader.vue'

beforeAll(() => {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open')
    }
  }
})

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

const media = () => h('img', { 'src': 'hero.png', 'alt': '', 'data-testid': 'media' })

function inDialog(props: Record<string, unknown>, slots: Record<string, () => unknown> = {}, dialogProps: Record<string, unknown> = {}) {
  return mount(Dialog, {
    attachTo: document.body,
    props: { isOpen: true, ...dialogProps },
    slots: { default: () => h(DialogHeroHeader, props, { media, ...slots }) },
  })
}

function dialogElement(): HTMLElement {
  return document.querySelector<HTMLElement>('dialog')!
}

describe('dialogHeroHeader', () => {
  it('names the dialog with its title and makes the title the default focus', async () => {
    inDialog({ title: 'Welcome aboard' })
    await nextTick()
    const heading = document.querySelector<HTMLElement>('.astryx-dialog-hero-header__heading')!
    expect(heading.textContent).toContain('Welcome aboard')
    expect(dialogElement().getAttribute('aria-labelledby')).toBe(heading.id)
    expect(heading.getAttribute('data-dialog-default-focus')).toBe('')
    expect(heading.getAttribute('tabindex')).toBe('-1')
  })

  it('puts the media above the title and the close button over the media', async () => {
    const onOpenChange = vi.fn()
    inDialog({ title: 'Welcome', onOpenChange })
    await nextTick()
    const area = document.querySelector('.astryx-dialog-hero-header__media')!
    expect(area.querySelector('[data-testid="media"]')).not.toBeNull()
    const close = area.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!
    close.click()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders no close button without an openChange listener', async () => {
    inDialog({ title: 'Welcome' })
    await nextTick()
    expect(document.querySelector('button[aria-label="Close"]')).toBeNull()
  })

  it('themes the close button for the media mode', async () => {
    inDialog({ title: 'Welcome', mediaMode: 'dark', onOpenChange: () => {} })
    await nextTick()
    const close = document.querySelector('button[aria-label="Close"]')!
    expect(close.closest('[data-media-mode="dark"], .astryx-media-theme')).not.toBeNull()
  })

  it('keeps a hidden title for screen readers without asking for focus', async () => {
    inDialog({ title: 'Welcome', isTitleHidden: true })
    await nextTick()
    const heading = document.querySelector<HTMLElement>('.astryx-dialog-hero-header__heading')!
    expect(dialogElement().getAttribute('aria-labelledby')).toBe(heading.id)
    expect(heading.hasAttribute('data-dialog-default-focus')).toBe(false)
  })

  it('does not ask for focus in an inline dialog', async () => {
    inDialog({ title: 'Preview' }, {}, { isInline: true })
    await nextTick()
    expect(document.querySelector('.astryx-dialog-hero-header__heading')!.hasAttribute('data-dialog-default-focus')).toBe(false)
  })

  it('hands the title id and focus to a custom heading itself, keeping a caller-set id', async () => {
    inDialog({}, { title: () => h('h2', { class: 'custom' }, 'Custom title') })
    await nextTick()
    const heading = document.querySelector<HTMLElement>('h2.custom')!
    expect(dialogElement().getAttribute('aria-labelledby')).toBe(heading.id)
    expect(heading.getAttribute('data-dialog-default-focus')).toBe('')
    expect(heading.parentElement!.hasAttribute('id')).toBe(false)
    document.body.innerHTML = ''

    inDialog({}, { title: () => h('h2', { id: 'mine' }, 'Own id') })
    await nextTick()
    expect(document.getElementById('mine')).not.toBeNull()
  })
})

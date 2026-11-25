import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import Thumbnail from './Thumbnail.vue'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/thumbnail.css'), 'utf8')

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function politeRegion(): string | null | undefined {
  return document.querySelector('[data-astryx-live-region="polite"]')?.textContent
}

describe('thumbnail', () => {
  it('shows the image placeholder when there is no source', () => {
    const wrapper = mount(Thumbnail, { props: { label: 'report.pdf' } })
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('report.pdf')
    expect(wrapper.find('.astryx-thumbnail__placeholder').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a remove button only when a listener is provided', async () => {
    const wrapper = mount(Thumbnail, {
      props: { label: 'photo.jpg', showRemoveOn: 'always' },
      attrs: { onRemove: () => {} },
    })
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove photo.jpg')
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('dims a disabled thumbnail and keeps Remove mounted, announced as disabled and inert', async () => {
    const wrapper = mount(Thumbnail, {
      props: { label: 'photo.jpg', isDisabled: true, showRemoveOn: 'always' },
      attrs: { onRemove: () => {} },
    })
    expect(wrapper.get('.astryx-thumbnail').attributes('data-disabled')).toBe('true')
    const remove = wrapper.get('button[aria-label="Remove photo.jpg"]')
    expect(remove.attributes('aria-disabled')).toBe('true')
    expect(remove.attributes('disabled')).toBeUndefined()
    await remove.trigger('click')
    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it.each([
    ['disabled', { isDisabled: true }],
    ['loading', { isLoading: true }],
  ] as const)('keeps Open mounted while %s, announced as disabled and calling nothing', async (_state, state) => {
    const onClick = vi.fn()
    const onAncestorClick = vi.fn()
    const wrapper = mount({
      components: { Thumbnail },
      setup: () => ({ onClick, onAncestorClick, state }),
      template: `
        <div @click="onAncestorClick">
          <Thumbnail src="/photo.jpg" alt="Photo" v-bind="state" @click="onClick" />
        </div>
      `,
    })
    const open = wrapper.get('button[aria-label="Open Photo"]')
    expect(open.attributes('aria-disabled')).toBe('true')
    expect(open.attributes('disabled')).toBeUndefined()

    await open.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    expect(onAncestorClick).not.toHaveBeenCalled()

    for (const key of ['Enter', ' ']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      open.element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    }
  })

  it('keeps focus on Open when the thumbnail starts loading', async () => {
    const wrapper = mount(Thumbnail, {
      props: { src: '/photo.jpg', alt: 'Photo' },
      attrs: { onClick: () => {} },
      attachTo: document.body,
    })
    const open = wrapper.get('button[aria-label="Open Photo"]')
    ;(open.element as HTMLButtonElement).focus()
    await wrapper.setProps({ isLoading: true })
    expect(document.activeElement).toBe(open.element)
    expect(open.attributes('aria-disabled')).toBe('true')
    wrapper.unmount()
  })

  it('lets an interactive Open call the click listener', async () => {
    const wrapper = mount(Thumbnail, {
      props: { src: '/photo.jpg', alt: 'Photo' },
      attrs: { onClick: () => {} },
    })
    const open = wrapper.get('button[aria-label="Open Photo"]')
    expect(open.attributes('aria-disabled')).toBeUndefined()
    await open.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('draws one ring for Open, on the image container, not a second one on the button', () => {
    const openFocus = /\.astryx-thumbnail__open:focus-visible\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(openFocus).toMatch(/outline: none;/)
    const frameRing = /\.astryx-thumbnail__frame:has\(:focus-visible\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(frameRing).toMatch(/outline: var\(--astryx-focus-outline-width/)
  })

  it('silences the upload Spinner and announces the busy start once', async () => {
    resetLiveRegionsForTest()
    const wrapper = mount(Thumbnail, {
      props: { src: '/photo.jpg', alt: 'Upload', isLoading: false },
      attachTo: document.body,
    })
    await nextFrame()
    expect(politeRegion() ?? '').toBe('')

    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    const spinner = wrapper.get('.astryx-spinner')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    expect(politeRegion()).toBe('Loading')
    wrapper.unmount()
  })
})

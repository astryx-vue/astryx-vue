import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Lightbox from './Lightbox.vue'

const gallery = [
  { alt: 'First', src: '/first.png' },
  { alt: 'Second', src: '/second.png' },
  { alt: 'Third', src: '/third.png' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

function shownAlt(wrapper: ReturnType<typeof mount>): string | undefined {
  return wrapper.get('img').attributes('alt')
}

function frame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

describe('lightbox viewer', () => {
  it('moves the gallery toward the button on each arrow\'s side in a right-to-left page', async () => {
    const wrapper = mount(Lightbox, {
      attachTo: document.body,
      props: { isOpen: true, media: gallery, defaultIndex: 1 },
      attrs: { style: 'direction: rtl' },
    })
    await wrapper.get('dialog').trigger('keydown', { key: 'ArrowLeft' })
    expect(shownAlt(wrapper)).toBe('Third')
    await wrapper.get('dialog').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.get('dialog').trigger('keydown', { key: 'ArrowRight' })
    expect(shownAlt(wrapper)).toBe('First')
  })

  it('opens the nearest item for a NaN or fractional index', () => {
    const nan = mount(Lightbox, { props: { isOpen: true, media: gallery, index: Number.NaN } })
    expect(shownAlt(nan)).toBe('First')
    const fraction = mount(Lightbox, { props: { isOpen: true, media: gallery, index: 1.6 } })
    expect(shownAlt(fraction)).toBe('Third')
  })

  it('opens when its first item arrives after it was opened', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: [] } })
    expect(wrapper.find('dialog').exists()).toBe(false)
    await wrapper.setProps({ media: gallery })
    await flushPromises()
    expect((wrapper.get('dialog').element as HTMLDialogElement).open).toBe(true)
  })

  it('returns to the fitted size on 0, and leaves Ctrl+0 to the browser', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery[0]!, hasZoom: true } })
    const zoom = wrapper.get('[aria-label="Zoom"]')
    await wrapper.get('dialog').trigger('keydown', { key: '+' })
    expect(zoom.attributes('aria-pressed')).toBe('true')
    await wrapper.get('dialog').trigger('keydown', { key: '0', ctrlKey: true })
    expect(zoom.attributes('aria-pressed')).toBe('true')
    await wrapper.get('dialog').trigger('keydown', { key: '0' })
    expect(zoom.attributes('aria-pressed')).toBe('false')
  })

  it('announces the shown item inside the open viewer', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery } })
    await wrapper.get('[aria-label="Next"]').trigger('click')
    await frame()
    const region = wrapper.get('dialog .astryx-lightbox__announcer')
    expect(region.text()).toContain('2')
    expect(region.text()).toContain('3')
  })

  it('closes on a click in the media column beside the photo', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery[0]! } })
    await wrapper.get('.astryx-lightbox__media').trigger('click')
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false])
  })

  it('wraps Tab inside the open viewer', async () => {
    mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery } })
    await flushPromises()
    // 测试环境的 showModal 不会真的打开，手动标成打开：关着且不显示的对话框里的控件不算 Tab 落脚点。
    document.querySelector('dialog')!.open = true
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('dialog button:not([disabled])'))
    const last = buttons[buttons.length - 1]!
    last.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[0])
  })
})

describe('lightbox layout', () => {
  it('fits the dynamic viewport, so a mobile toolbar does not cover the caption', () => {
    const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/lightbox.css'), 'utf8')
    const viewer = /\.astryx-lightbox \{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(viewer).toMatch(/height: 100dvh;/)
    expect(css).toMatch(/max-height: calc\(100dvh - 7rem\);/)
  })
})

describe('lightbox video', () => {
  const clip = { alt: 'Clip', src: '/clip.mp4', type: 'video' as const }

  it('does not autoplay while closed, and pauses a playing video on close', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: false, media: clip, hasAutoPlay: true } })
    const video = wrapper.get('video').element as HTMLVideoElement
    expect(video.autoplay).toBe(false)

    await wrapper.setProps({ isOpen: true })
    expect(video.autoplay).toBe(true)
    Object.defineProperty(video, 'paused', { configurable: true, value: false })
    const pause = vi.spyOn(video, 'pause').mockImplementation(() => {})
    await wrapper.setProps({ isOpen: false })
    expect(pause).toHaveBeenCalled()
  })
})

describe('lightbox focus', () => {
  it('returns focus to its opener when it unmounts while open', async () => {
    const opener = document.createElement('button')
    opener.textContent = 'Open'
    document.body.append(opener)
    opener.focus()
    const Host = defineComponent({
      setup: () => ({ isShown: ref(true) }),
      render() {
        return this.isShown ? h(Lightbox, { isOpen: true, media: gallery }) : null
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    const inside = document.querySelector<HTMLButtonElement>('dialog button')!
    inside.focus()

    ;(wrapper.vm as unknown as { isShown: boolean }).isShown = false
    await flushPromises()
    expect(document.activeElement).toBe(opener)
  })
})

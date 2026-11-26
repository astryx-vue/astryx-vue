import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Lightbox from './Lightbox.vue'

/** happy-dom 不做排版，量不出截断；这里直接控制「两行放不下」的结果。 */
const truncated = ref(false)
vi.mock('../Text/useTruncation.js', () => ({
  useTruncation: () => ({ bind: () => {}, isTruncated: truncated, fullText: ref('') }),
}))

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/lightbox.css'), 'utf8')

const longCaption = 'A long caption that runs past two lines of the band under the photo, so it ends in a more link.'
const media = [
  { alt: 'Coast', caption: longCaption, src: '/coast.png' },
  { alt: 'Building', src: '/building.png' },
  { alt: 'Forest', caption: 'Short.', src: '/forest.png' },
]

function mountGallery(hasZoom = true) {
  const Host = defineComponent({
    components: { Lightbox },
    setup: () => ({ index: ref(0), isOpen: ref(true), media, hasZoom }),
    template: `<Lightbox v-model:is-open="isOpen" v-model:index="index" :media="media" :has-zoom="hasZoom" />`,
  })
  return mount(Host, { attachTo: document.body })
}

afterEach(() => {
  truncated.value = false
  document.body.innerHTML = ''
})

describe('lightbox gallery caption band', () => {
  it('keeps a two-line band under every page, with no backing where there is no caption', async () => {
    const wrapper = mountGallery()
    expect(wrapper.get('.astryx-lightbox').attributes('data-gallery')).toBe('true')
    expect(wrapper.get('.astryx-lightbox__caption-band').attributes('data-empty')).toBeUndefined()
    expect(wrapper.get('.astryx-lightbox__caption').text()).toBe(longCaption)

    await wrapper.get('[aria-label="Next"]').trigger('click')
    const band = wrapper.get('.astryx-lightbox__caption-band')
    expect(band.attributes('data-empty')).toBe('')
    expect(band.find('.astryx-lightbox__caption-panel').exists()).toBe(false)

    const bandRule = /\.astryx-lightbox__caption-band\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(bandRule).toMatch(/height: var\(--_lightbox-caption-band-height\);/)
    expect(css).toMatch(/--_lightbox-caption-band-height: calc\(2 \* var\(--astryx-text-body-size, 1rem\) \* var\(--astryx-text-body-leading, 1\.4286\)\);/)
    expect(css).toMatch(/-webkit-line-clamp: 2;/)
  })

  it('describes the viewer with the whole caption', () => {
    const wrapper = mountGallery()
    const dialog = wrapper.get('dialog')
    const id = dialog.attributes('aria-describedby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)?.textContent?.trim()).toBe(longCaption)
  })

  it('shows no toggle when the caption fits in two lines', () => {
    const wrapper = mountGallery()
    expect(wrapper.find('.astryx-lightbox__caption-toggle').exists()).toBe(false)
  })

  it('ends a cut caption in "more", which opens the whole caption and turns into "less"', async () => {
    truncated.value = true
    const wrapper = mountGallery()
    const toggle = wrapper.get('.astryx-lightbox__caption-toggle')
    expect(toggle.text()).toBe('more')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-controls')).toBe(wrapper.get('.astryx-lightbox__caption').attributes('id'))

    await toggle.trigger('click')
    expect(toggle.text()).toBe('less')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.astryx-lightbox__caption-band').attributes('data-expanded')).toBe('true')
    expect(wrapper.emitted()).not.toHaveProperty('update:isOpen')
  })

  it('closes an open caption when paging', async () => {
    truncated.value = true
    const wrapper = mountGallery()
    await wrapper.get('.astryx-lightbox__caption-toggle').trigger('click')
    await wrapper.get('[aria-label="Next"]').trigger('click')
    await wrapper.get('[aria-label="Next"]').trigger('click')
    expect(wrapper.get('.astryx-lightbox__caption-band').attributes('data-expanded')).toBeUndefined()
    expect(wrapper.get('.astryx-lightbox__caption-toggle').text()).toBe('more')
  })

  it.each([
    ['the photo', true, '.astryx-lightbox__frame'],
    ['Close', false, '.astryx-lightbox__close'],
  ] as const)('moves focus to %s when paging from a focused toggle', async (_target, hasZoom, selector) => {
    truncated.value = true
    const wrapper = mountGallery(hasZoom)
    const toggle = wrapper.get('.astryx-lightbox__caption-toggle').element as HTMLButtonElement
    toggle.focus()
    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get(selector).element)
  })

  it('puts a single photo\'s caption on the band\'s backing, and draws no band without a caption', () => {
    const wrapper = mount(Lightbox, {
      props: { isOpen: true, media: media[0]! },
    })
    expect(wrapper.find('.astryx-lightbox__caption-band .astryx-lightbox__caption-panel').exists()).toBe(true)
    expect(wrapper.get('dialog').attributes('data-caption-band')).toBe('true')
    expect(wrapper.find('.astryx-lightbox__counter').exists()).toBe(false)
    const caption = wrapper.get('.astryx-lightbox__caption')
    expect(wrapper.get('dialog').attributes('aria-describedby')).toBe(caption.attributes('id'))

    const bare = mount(Lightbox, { props: { isOpen: true, media: media[1]! } })
    expect(bare.find('.astryx-lightbox__caption-band').exists()).toBe(false)
    expect(bare.get('dialog').attributes('data-caption-band')).toBeUndefined()
  })
})

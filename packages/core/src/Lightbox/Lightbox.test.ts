import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import Lightbox from './Lightbox.vue'
import { useLightbox } from './useLightbox.js'

const photo = {
  alt: 'Coastal shoreline with ocean waves',
  caption: 'A scenic coastline.',
  src: '/template-assets/light-scene-horizontal-1.png',
}

const Host = defineComponent({
  components: { Lightbox },
  setup() {
    const isOpen = ref(true)
    const index = ref(0)
    const media = [
      photo,
      { ...photo, alt: 'Modern building', src: '/template-assets/building.png' },
    ]
    return { index, isOpen, media }
  },
  template: `
    <Lightbox
      v-model:is-open="isOpen"
      v-model:index="index"
      :media="media"
      has-zoom
    />
  `,
})

describe('lightbox', () => {
  it('shows the active image, caption, counter, and gallery controls', async () => {
    const wrapper = mount(Host)
    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('aria-label')).toBe(photo.alt)
    expect(wrapper.get('img').attributes('alt')).toBe(photo.alt)
    expect(wrapper.get('.astryx-lightbox__caption').text()).toBe(photo.caption)
    expect(wrapper.get('.astryx-lightbox__counter').text()).toBe('1 / 2')
    expect(wrapper.get('[aria-label="Zoom"]').attributes('aria-pressed')).toBe('false')

    await wrapper.get('[aria-label="Next"]').trigger('click')
    expect(wrapper.get('img').attributes('alt')).toBe('Modern building')
    expect(wrapper.get('.astryx-lightbox__counter').text()).toBe('2 / 2')
  })

  it('closes from the close button', async () => {
    const wrapper = mount(Lightbox, {
      props: { isOpen: true, media: photo },
    })
    await wrapper.get('[aria-label="Close"]').trigger('click')
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false])
  })

  it('opens a gallery at an index from useLightbox', () => {
    const lightbox = useLightbox({
      media: [photo, { ...photo, alt: 'Second' }],
    })
    lightbox.open(1)
    expect(lightbox.isOpen.value).toBe(true)
    expect(lightbox.index.value).toBe(1)
    expect(lightbox.bindings.value.isOpen).toBe(true)
    expect(lightbox.bindings.value.index).toBe(1)
  })
})

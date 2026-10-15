import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { imageModeFromPixels, perceptualLightness, useImageMode } from './useImageMode.js'

describe('useImageMode', () => {
  it('classifies sampled pixels by perceptual lightness', () => {
    expect(perceptualLightness(0, 0, 0)).toBeLessThan(0.1)
    expect(perceptualLightness(255, 255, 255)).toBeGreaterThan(0.9)
    expect(imageModeFromPixels(new Uint8ClampedArray([0, 0, 0, 255]))).toBe('dark')
    expect(imageModeFromPixels(new Uint8ClampedArray([255, 255, 255, 255]))).toBe('light')
  })

  it('returns the fallback when the image cannot be read', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('offline')
    }))
    const src = ref('https://example.test/photo.jpg')
    const Host = defineComponent({
      setup() {
        const mode = useImageMode(src, { fallback: 'dark' })
        return () => mode.value ?? 'empty'
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    await Promise.resolve()
    expect(wrapper.text()).toBe('dark')
    wrapper.unmount()
    vi.unstubAllGlobals()
  })
})

import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue, watch } from 'vue'

export interface ImageSampleRegion {
  /** 左边缘，0 是左，1 是右。 */
  x: number
  /** 上边缘，0 是上，1 是下。 */
  y: number
  /** 宽度占整张图的比例。 */
  width: number
  /** 高度占整张图的比例。 */
  height: number
}

export interface UseImageModeOptions {
  /** 只采样这一块。不传时用整张图。坐标都是 0 到 1。 */
  region?: ImageSampleRegion
  /** 低于这个亮度算暗，高于算亮。 */
  threshold?: number
  /** 还在加载，或者读图失败时返回的值。 */
  fallback?: 'dark' | 'light' | null
}

/**
 * APCA 感知亮度。先把 sRGB 按 2.4 线性化，再用接近 BT.709 的系数合成，
 * 最后做 0.56 次方，让 0.5 接近视觉上的中灰。饱和色比简单的伽马亮度更准。
 */
export function perceptualLightness(r: number, g: number, b: number): number {
  const linear = (channel: number): number => (channel / 255) ** 2.4
  const y = 0.2126729 * linear(r) + 0.7151522 * linear(g) + 0.072175 * linear(b)
  return y ** 0.56
}

/** 一组采样像素的平均亮度，再和阈值比出深浅。 */
export function imageModeFromPixels(pixels: Uint8ClampedArray, threshold = 0.5): 'dark' | 'light' {
  let red = 0
  let green = 0
  let blue = 0
  let count = 0
  for (let index = 0; index < pixels.length; index += 4) {
    red += pixels[index] ?? 0
    green += pixels[index + 1] ?? 0
    blue += pixels[index + 2] ?? 0
    count += 1
  }
  const safeCount = count || 1
  const lightness = perceptualLightness(red / safeCount, green / safeCount, blue / safeCount)
  return lightness > threshold ? 'light' : 'dark'
}

/**
 * 按图片亮度判断该用深色还是浅色前景。采样走 OffscreenCanvas，不往页面上画。
 * 跨域或网络失败时返回 `fallback`。
 */
export function useImageMode(
  src: MaybeRefOrGetter<string | null | undefined>,
  options: MaybeRefOrGetter<UseImageModeOptions> = {},
): Ref<'dark' | 'light' | null> {
  const mode = ref<'dark' | 'light' | null>(toValue(options).fallback ?? null)
  let request = 0

  async function detect(url: string): Promise<void> {
    const current = ++request
    const settings = toValue(options)
    const threshold = settings.threshold ?? 0.5
    const fallback = settings.fallback ?? null
    mode.value = fallback
    try {
      const response = await fetch(url)
      if (!response.ok)
        throw new Error(`image ${response.status}`)
      const bitmap = await createImageBitmap(await response.blob())
      if (current !== request)
        return
      const region = settings.region
      const sx = region ? Math.round(region.x * bitmap.width) : 0
      const sy = region ? Math.round(region.y * bitmap.height) : 0
      const sw = region ? Math.max(1, Math.round(region.width * bitmap.width)) : bitmap.width
      const sh = region ? Math.max(1, Math.round(region.height * bitmap.height)) : bitmap.height
      const sample = 10
      const canvas = new OffscreenCanvas(sample, sample)
      const context = canvas.getContext('2d')
      if (!context)
        return
      context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sample, sample)
      const pixels = context.getImageData(0, 0, sample, sample).data
      if (current !== request)
        return
      mode.value = imageModeFromPixels(pixels, threshold)
    }
    catch {
      if (current === request)
        mode.value = fallback
    }
  }

  watch(() => toValue(src), (url) => {
    if (!url) {
      request += 1
      mode.value = toValue(options).fallback ?? null
      return
    }
    void detect(url)
  }, { immediate: true })

  onScopeDispose(() => {
    request += 1
  })

  return mode
}

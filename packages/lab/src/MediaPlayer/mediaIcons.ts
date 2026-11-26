import type { Component, ComputedRef, MaybeRefOrGetter } from 'vue'
import { useSemanticIcon } from '@astryx-vue/core'
import { computed, defineComponent, h, toValue } from 'vue'

/**
 * 媒体图标在图标表里的键。主题可以按键换掉任何一个：
 * `defineTheme({ icons: { 'media:play': 'mdi:play' } })`。
 */
export const MEDIA_ICON_KEYS = {
  play: 'media:play',
  pause: 'media:pause',
  replay: 'media:replay',
  skipBack: 'media:skip-back',
  skipForward: 'media:skip-forward',
  volumeHigh: 'media:volume-high',
  volumeLow: 'media:volume-low',
  volumeOff: 'media:volume-off',
  fullscreenEnter: 'media:fullscreen-enter',
  fullscreenExit: 'media:fullscreen-exit',
  captions: 'media:captions',
  previousTrack: 'media:previous-track',
  nextTrack: 'media:next-track',
  audioFile: 'media:audio-file',
} as const

export type MediaIconName = keyof typeof MEDIA_ICON_KEYS

type Shape
  = | { tag: 'path', d: string }
    | { tag: 'rect', x?: number, y?: number, width: number, height: number, rx?: number }
    | { tag: 'line', x1: number, x2: number, y1: number, y2: number }
    | { tag: 'circle', cx: number, cy: number, r: number }

const SPEAKER = 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z'

function path(d: string): Shape {
  return { tag: 'path', d }
}

// 备用图形用 Lucide 的画法（ISC 许可），主题没映射媒体键时也和默认主题的 Lucide 图标一致。
const FALLBACK_SHAPES: Record<MediaIconName, readonly Shape[]> = {
  play: [path('M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z')],
  pause: [
    { tag: 'rect', x: 14, y: 3, width: 5, height: 18, rx: 1 },
    { tag: 'rect', x: 5, y: 3, width: 5, height: 18, rx: 1 },
  ],
  replay: [path('M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'), path('M3 3v5h5')],
  skipBack: [
    path('M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z'),
    path('M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z'),
  ],
  skipForward: [
    path('M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z'),
    path('M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z'),
  ],
  volumeHigh: [path(SPEAKER), path('M16 9a5 5 0 0 1 0 6'), path('M19.364 18.364a9 9 0 0 0 0-12.728')],
  volumeLow: [path(SPEAKER), path('M16 9a5 5 0 0 1 0 6')],
  volumeOff: [
    path(SPEAKER),
    { tag: 'line', x1: 22, x2: 16, y1: 9, y2: 15 },
    { tag: 'line', x1: 16, x2: 22, y1: 9, y2: 15 },
  ],
  fullscreenEnter: [
    path('M8 3H5a2 2 0 0 0-2 2v3'),
    path('M21 8V5a2 2 0 0 0-2-2h-3'),
    path('M3 16v3a2 2 0 0 0 2 2h3'),
    path('M16 21h3a2 2 0 0 0 2-2v-3'),
  ],
  fullscreenExit: [
    path('M8 3v3a2 2 0 0 1-2 2H3'),
    path('M21 8h-3a2 2 0 0 1-2-2V3'),
    path('M3 16h3a2 2 0 0 1 2 2v3'),
    path('M16 21v-3a2 2 0 0 1 2-2h3'),
  ],
  captions: [
    { tag: 'rect', x: 3, y: 5, width: 18, height: 14, rx: 2 },
    path('M7 15h4M15 15h2M7 11h2M13 11h4'),
  ],
  previousTrack: [
    path('M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z'),
    path('M3 20V4'),
  ],
  nextTrack: [
    path('M21 4v16'),
    path('M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z'),
  ],
  audioFile: [
    path('M11.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v10.35'),
    path('M14 2v5a1 1 0 0 0 1 1h5'),
    path('M8 20v-7l3 1.474'),
    { tag: 'circle', cx: 6, cy: 20, r: 2 },
  ],
}

const glyphCache = new Map<MediaIconName, Component>()

/** 一个备用图形组件，尺寸跟着外面的图标槽走（1em）。 */
function fallbackGlyph(name: MediaIconName): Component {
  let glyph = glyphCache.get(name)
  if (glyph == null) {
    glyph = defineComponent({
      name: `MediaGlyph${name[0]!.toUpperCase()}${name.slice(1)}`,
      setup() {
        return () => h(
          'svg',
          {
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'width': '1em',
            'height': '1em',
            'fill': 'none',
            'stroke': 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
          },
          FALLBACK_SHAPES[name].map(({ tag, ...attrs }) => h(tag, attrs)),
        )
      },
    })
    glyphCache.set(name, glyph)
  }
  return glyph
}

/**
 * 某个媒体图标：当前主题给这个键映射了图标时交出键名，让按钮按主题画；
 * 否则交出 Lucide 画法的备用图形。结果可以直接传给按钮的 `icon`。
 */
export function useMediaIcon(name: MaybeRefOrGetter<MediaIconName>): ComputedRef<string | Component> {
  const themed = useSemanticIcon(() => MEDIA_ICON_KEYS[toValue(name)])
  return computed(() => themed.value != null ? MEDIA_ICON_KEYS[toValue(name)] : fallbackGlyph(toValue(name)))
}

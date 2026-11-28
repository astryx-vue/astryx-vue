export type LightboxMediaType = 'image' | 'video'

export interface LightboxMedia {
  src: string
  alt: string
  caption?: string
  /**
   * Zoom and pan are only available for images.
   * @default 'image'
   */
  type?: LightboxMediaType
}

export interface LightboxProps {
  /** Whether the lightbox is open. Bind with `v-model:is-open`. */
  isOpen: boolean
  /**
   * One item, or a gallery. An array shows previous, next, and a counter.
   */
  media: LightboxMedia | readonly LightboxMedia[]
  /**
   * Controlled gallery index. Bind with `v-model:index`.
   */
  index?: number
  /**
   * Initial index when `index` is omitted.
   * @default 0
   */
  defaultIndex?: number
  /**
   * Enable zoom (images only). A pinch or a ctrl-wheel zooms about the fingers or the pointer. A double tap fills the
   * viewer and a double-click zooms 2×, about that point, and the next goes back. Enter, Space, `+`, and `-` zoom 2×
   * about the centre and back, and `0` returns to the fitted size. When zoomed, drag or scroll a trackpad to pan, or use
   * the arrow keys. On a phone or a tablet, the pan has momentum.
   * @default false
   */
  hasZoom?: boolean
  /**
   * Start video playback when a video item is shown in an open viewer.
   * @default false
   */
  hasAutoPlay?: boolean
}

export interface LightboxEmits {
  'update:isOpen': [isOpen: boolean]
  'update:index': [index: number]
}

export interface UseLightboxOptions {
  media: LightboxMedia | readonly LightboxMedia[]
  hasZoom?: boolean
  hasAutoPlay?: boolean
}

export interface LightboxTriggerProps {
  'role': 'button'
  'tabindex': 0
  'aria-haspopup': 'dialog'
  'onClick': () => void
  'onKeydown': (event: KeyboardEvent) => void
}

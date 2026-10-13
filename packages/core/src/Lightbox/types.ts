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
   * Double-click, Enter, Space, `+`, and `-` zoom images. Arrow keys pan while zoomed.
   * @default false
   */
  hasZoom?: boolean
  /**
   * Start video playback when a video item is shown.
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

import type { ComputedRef, MaybeRef, Ref, VNodeChild } from 'vue'

/**
 * Surface the scrim paints behind the overlay content.
 *
 * `dark` and `light` both describe the *scrim*, not the page: the content
 * inside the scrim is switched to the matching surface theme, so text and
 * controls stay legible on top of it. `false` draws no background at all and
 * leaves the content on the ambient theme.
 */
export type OverlayScrimMode = 'dark' | 'light' | false

/**
 * Where the scrim covers the base surface.
 *
 * `fill` covers the whole surface, while `bottom` and `top` are strips pinned
 * to one edge that slide in from that edge.
 */
export type OverlayPosition = 'fill' | 'bottom' | 'top'

/**
 * Alignment of the overlay content inside the scrim.
 *
 * The scrim lays its content out in a column, so this is the horizontal
 * alignment: `start` keeps content at the leading edge, `end` at the trailing
 * edge, and `center` centers it on both axes.
 */
export type OverlayAlign = 'start' | 'center' | 'end'

/**
 * What reveals the overlay while `isOpen` stays unbound.
 *
 * `hover` reveals on pointer hover and on keyboard focus, `focus` reveals only
 * on focus, and `always` keeps the overlay visible. `hover-or-focus` is an
 * alias of `hover`.
 */
export type OverlayShowOn = 'hover' | 'always' | 'focus' | 'hover-or-focus'

export interface OverlayProps {
  /**
   * What reveals the overlay while `isOpen` stays unbound.
   *
   * This is CSS-driven, so it needs no JavaScript to run. On a touch device a
   * hover overlay has no pointer to follow, so a tap on the base surface
   * toggles it instead.
   *
   * @default 'always'
   */
  showOn?: OverlayShowOn
  /**
   * Visibility controlled from JavaScript. Takes precedence over `showOn` and
   * over tap-to-toggle. Bind it with `v-model:isOpen`; leaving it unbound hands
   * visibility back to `showOn`.
   *
   * @default undefined
   */
  isOpen?: boolean
  /**
   * Surface the scrim paints behind the overlay content.
   *
   * `false` keeps the overlay content but drops the background, which is the
   * right choice when the base surface already reads well underneath.
   *
   * @default 'dark'
   */
  scrim?: OverlayScrimMode
  /**
   * Where the scrim covers the base surface.
   * @default 'fill'
   */
  position?: OverlayPosition
  /**
   * Alignment of the overlay content inside the scrim.
   * @default 'end'
   */
  align?: OverlayAlign
}

export interface OverlaySlots {
  /**
   * The base surface: media, a video, artwork, or any bounded content the
   * overlay sits on top of.
   */
  default?: () => VNodeChild
  /**
   * The overlay content drawn inside the scrim. Keep it short — one action or
   * one label — so it stays legible over the base surface.
   *
   * The scrim is rendered only while this slot is provided.
   */
  content?: () => VNodeChild
}

export interface OverlayScrimProps {
  /**
   * Surface the scrim paints, and the surface theme the content inherits.
   * @default 'dark'
   */
  scrim?: OverlayScrimMode
  /**
   * Where the scrim covers the base surface.
   * @default 'fill'
   */
  position?: OverlayPosition
  /**
   * Alignment of the overlay content inside the scrim.
   * @default 'end'
   */
  align?: OverlayAlign
  /**
   * What reveals the overlay while `isOpen` stays unbound.
   * @default 'always'
   */
  showOn?: OverlayShowOn
  /**
   * Visibility controlled from JavaScript. When set, `showOn` is ignored: the
   * scrim is shown while `true`, and hidden and made inert while `false`.
   *
   * @default undefined
   */
  isOpen?: boolean
}

export interface OverlayScrimSlots {
  /** The overlay content. */
  default?: () => VNodeChild
}

/** Attributes the container element of an overlay needs. */
export interface OverlayContainerProps {
  /** Ancestor hook the CSS-driven reveal states select on. */
  'class': string
  'data-pressable-container': string
  /**
   * Tap-to-toggle handler, present only on a touch device in hover mode.
   * @default undefined
   */
  'onClick': ((event: MouseEvent) => void) | undefined
}

export interface UseOverlayOptions {
  /** @default 'always' */
  showOn?: MaybeRef<OverlayShowOn | undefined>
  /** @default undefined */
  isOpen?: MaybeRef<boolean | undefined>
  /** @default 'dark' */
  scrim?: MaybeRef<OverlayScrimMode | undefined>
  /** @default 'fill' */
  position?: MaybeRef<OverlayPosition | undefined>
  /** @default 'end' */
  align?: MaybeRef<OverlayAlign | undefined>
}

export interface UseOverlayResult {
  /** Attach to the container element with `ref="containerRef"`. */
  containerRef: Ref<HTMLElement | null>
  /** Attributes for the container element, spread with `v-bind`. */
  containerProps: ComputedRef<OverlayContainerProps>
  /** Props for the `OverlayScrim` rendered inside the container. */
  scrimProps: ComputedRef<OverlayScrimProps>
  /**
   * Visibility the scrim actually uses: the bound `isOpen`, the tap toggle on a
   * touch device, or `undefined` when CSS drives the reveal.
   */
  isOpen: ComputedRef<boolean | undefined>
  /** Whether the base surface is currently tapped to toggle the overlay. */
  hasTouchToggle: ComputedRef<boolean>
  /** Flips the tap toggle. Ignored while `isOpen` is bound. */
  toggle: () => void
}

import type { MaybeRef, VNode } from 'vue'

/**
 * Named height budget for the sheet.
 *
 * `hug` fits the content up to 92% of the viewport, `capped` is a scrolling
 * mid-height panel (about 62%), and `tall` is a pinned near-full panel (about
 * 92%) for content that streams in. Only a fully expanded `tall` sheet
 * accommodates the on-screen keyboard, because only it has height to give.
 */
export type BottomSheetHeight
  = | 'hug'
    | 'capped'
    | 'tall'

/**
 * Extra height the sheet can rest at when dragged, expressed as the sheet's
 * visible height: a number in `(0, 1]` is a viewport fraction (`0.5` is half
 * the screen), a `'50%'` string is the same thing in CSS, and a `'320px'`
 * string is an absolute length. Anything else is ignored.
 */
export type BottomSheetSnapPoint = number | string

/**
 * How the sheet may dismiss itself, matching `Dialog`.
 *
 * `info` allows Escape, a scrim click, and a swipe; `form` allows Escape only,
 * protecting entered data; `required` blocks every implicit dismissal and
 * announces the sheet as an alert dialog.
 */
export type BottomSheetPurpose
  = | 'required'
    | 'form'
    | 'info'

/** Inner padding of the content box, using the spacing scale. */
export type BottomSheetPadding = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10

/** Motion phase the panel reports to its host. */
export type BottomSheetMotion = 'entering' | 'exiting'

/** Presentation state of the sheet panel. */
export type BottomSheetState = 'hidden' | 'open' | 'exiting'

export interface BottomSheetProps {
  /**
   * Controlled open state, bound with `v-model:isOpen`.
   *
   * Leave it unbound and the sheet manages its own state: Escape, a scrim
   * click, or a swipe still closes it. `openChange` reports every request
   * either way.
   * @default false
   */
  isOpen?: boolean
  /**
   * Accessible name for the sheet. Required — the sheet has no built-in
   * heading to derive a name from.
   */
  label: string
  /**
   * 放进 `BottomSheetSwitcher` 时的名字。切换器靠它决定哪一张是当前页。
   * 单独使用时可以不传。
   */
  sheetId?: string
  /**
   * Renders the panel in the document flow instead of a native `<dialog>`,
   * without a scrim, focus trap, or motion. Used to preview the surface inside
   * a container that is already inert, such as component documentation.
   * @default false
   */
  isInline?: boolean
  /**
   * How tall the sheet is: a named budget, a number of pixels, or a CSS length.
   * @default 'capped'
   */
  height?: BottomSheetHeight | number | string
  /**
   * Extra heights the sheet can rest at when dragged. The sheet's own height is
   * always the tallest stop, and omitting this gives a sheet that only opens
   * and closes.
   */
  snapPoints?: readonly BottomSheetSnapPoint[]
  /**
   * Inner padding of the content box using the spacing scale. When omitted, the
   * theme decides, falling back to the `--spacing-4` step (16px) on every
   * logical edge. Pass `0` for a flush content box. The content box is a
   * container, so a lone `Section` child escapes the inset.
   * @default undefined
   */
  padding?: BottomSheetPadding
  /**
   * Configures implicit dismissal, matching `Dialog`.
   * @default 'info'
   */
  purpose?: BottomSheetPurpose
  /**
   * Whether a standalone sheet renders a scrim and opens modally. Without it
   * the page behind stays interactive and scrollable while the sheet is open.
   * @default true
   */
  hasScrim?: boolean
  /**
   * Element that receives focus after the sheet closes, instead of the element
   * that was focused when it opened. Accepts a template ref or an element.
   * @default null
   */
  finalFocusRef?: MaybeRef<HTMLElement | null>
}

export interface BottomSheetEmits {
  /** Emitted with the open state the sheet asks for. */
  'openChange': [isOpen: boolean]
  /** Emitted by `v-model:isOpen`. */
  'update:isOpen': [isOpen: boolean]
  /** Emitted when an entrance or exit motion starts. */
  'motionStart': [motion: BottomSheetMotion]
  /** Emitted when an entrance or exit motion finishes. */
  'motionComplete': [motion: BottomSheetMotion]
  /** Emitted with the sheet's visible height whenever a drag settles on a stop. */
  'snap': [visibleHeight: number]
}

export interface BottomSheetSlots {
  /** Content of the sheet, rendered in the scrolling area below the handle. */
  default?: () => VNode[]
}

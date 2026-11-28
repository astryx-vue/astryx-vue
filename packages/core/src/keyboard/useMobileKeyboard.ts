/**
 * @file useMobileKeyboard.ts
 * @input A target element and its scroll body, the keyboard module's reports
 *   and focus claim, and the layout guide
 * @output useMobileKeyboard, which keeps a focused field in the target above
 *   the on-screen keyboard and returns the inset and a dismiss
 * @position Keyboard module, internal to core. BottomSheet passes its panel.
 */

import type { MaybeRefOrGetter, Ref } from 'vue'
import type { KeyboardMove } from './keyboardGeometry'
import type { SheetKeyboardLayout } from './sheetKeyboardBody'
import { readonly, shallowRef, toValue, watch } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery'
import { useAttachment } from '../gestures/useAttachment'
import { TOUCH_QUERY } from '../utils/touchQueries'
import { FIELD_OFFSET } from './keyboardGeometry'
import { followKeyboard, keepFieldAboveKeyboard } from './keyboardTarget'
import { attachSheetKeyboard } from './sheetKeyboard'

/** How a target keeps a focused field above the on-screen keyboard. */
export interface MobileKeyboardOptions {
  /**
   * How the target moves the field. `'ride'` moves the target with the
   * keyboard; with `inset`, it reveals the field with the body and rides the
   * body's content instead. `'reveal'` scrolls the field into place in the
   * target, a scroller. Without `move`, the target is a field itself, which
   * decides where it is when it gains focus.
   */
  move?: KeyboardMove
  /** Reserves the keyboard's inset at the end of `body`'s content. */
  inset?: boolean
  /** The target's scroll body, whose content ends with the inset. */
  body?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** The gap kept between the focused field and the keyboard, CSS px. */
  offset?: MaybeRefOrGetter<number>
  /** Whether the target follows the keyboard at all. */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** Whether the target is at its full height, where it reveals fields. */
  isExpanded?: MaybeRefOrGetter<boolean>
  /** Whether the target is open. Focus that leaves for nothing parks on it. */
  isOpen?: MaybeRefOrGetter<boolean>
  /** Whether the page's own scroll is locked under the target. */
  isPageScrollLocked?: MaybeRefOrGetter<boolean>
}

/** What useMobileKeyboard returns. */
export interface MobileKeyboard {
  /** The inset the target lays out at its body's content end, CSS px. */
  readonly inset: Readonly<Ref<number>>
  /**
   * Dismisses the keyboard, keeping the inset while the keyboard goes. The
   * focused field blurs, or `focusTarget` takes focus.
   */
  readonly dismiss: (focusTarget?: HTMLElement) => void
}

/**
 * Keeps a focused field in `target`'s element above the on-screen keyboard
 * (see README.md). A sheet passes its panel and body, and the composable
 * reserves the inset at the end of the body's content. Returns the inset the
 * keyboard takes there, CSS px, or 0 without a keyboard, and a dismiss.
 *
 * Every option is read when it is used, so a listener always sees the
 * current value.
 *
 * @example
 * ```
 * const keyboard = useMobileKeyboard(panel, { move: 'ride', inset: true, body, offset: 48, isEnabled, isExpanded, isOpen, isPageScrollLocked })
 * ```
 */
export function useMobileKeyboard(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: MobileKeyboardOptions = {},
): MobileKeyboard {
  const move = (): KeyboardMove | undefined => options.move
  const reservesInset = (): boolean => options.inset ?? false
  const offset = (): number => toValue(options.offset) ?? FIELD_OFFSET
  const isEnabled = (): boolean => toValue(options.isEnabled) ?? true
  const isExpanded = (): boolean => toValue(options.isExpanded) ?? true
  const isOpen = (): boolean => toValue(options.isOpen) ?? true
  const isPageScrollLocked = (): boolean =>
    toValue(options.isPageScrollLocked) ?? false

  // The inset the keyboard takes at the end of the body's content, CSS px.
  const inset = shallowRef(0)
  const layout: SheetKeyboardLayout = { hasLayout: false, retainLayout: false }
  // Touch-only work, the ride and the reveal-pan watch, attaches only under a
  // coarse primary pointer (the touch query). Under a fine one, the
  // composable registers no touch listener.
  const isTouch = useMediaQuery(TOUCH_QUERY)

  const dismiss = (focusTarget?: HTMLElement): void => {
    const element = toValue(target)
    const activeElement = document.activeElement
    if (
      !isEnabled()
      || element == null
      || !(activeElement instanceof HTMLElement)
      || activeElement === element
      || !element.contains(activeElement)
    ) {
      return
    }
    // Keep the current keyboard scroll range while the keyboard goes.
    // Viewport resize events unwind that layout as the visual viewport
    // recovers, avoiding a content jump on the first drag frame.
    layout.retainLayout = layout.hasLayout
    if (focusTarget == null) {
      activeElement.blur()
    }
    else {
      focusTarget.focus({ preventScroll: true })
    }
  }

  // Syncs the on-screen keyboard with closing: a target that closes blurs its
  // focused field, which dismisses the keyboard.
  watch(
    () => isEnabled() && !isOpen(),
    (closing) => {
      if (closing) {
        dismiss()
      }
    },
    { immediate: true, flush: 'sync' },
  )

  // A docked target, a scroller or a field, which moves no inset.
  useAttachment(
    target,
    (element) => {
      const how = move()
      if (!isEnabled() || reservesInset() || !isTouch.value) {
        return () => {}
      }
      return how == null
        ? keepFieldAboveKeyboard(element, { offset: offset() })
        : followKeyboard(element, { move: how, offset: offset() })
    },
    () => `${isEnabled()}|${move()}|${reservesInset()}|${offset()}|${isTouch.value}`,
  )

  useAttachment(
    target,
    (sheet) => {
      const body = toValue(options.body)
      if (!isEnabled() || !reservesInset() || body == null) {
        return () => {}
      }
      return attachSheetKeyboard(sheet, body, {
        offset: offset(),
        isExpanded,
        isOpen,
        isPageScrollLocked: isPageScrollLocked(),
        isTouch: isTouch.value,
        layout,
        onInset: (value) => {
          inset.value = value
        },
      })
    },
    () =>
      `${isEnabled()}|${reservesInset()}|${isPageScrollLocked()}|${isTouch.value}|${offset()}|${toValue(options.body) != null}`,
  )

  return { inset: readonly(inset), dismiss }
}

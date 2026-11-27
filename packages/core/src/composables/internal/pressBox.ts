/**
 * @file pressBox.ts
 * @input A control's box: the non-text part around its input and indicator
 * @output PRESS_BOX_ATTRIBUTE and pressBoxProps, which mark the box;
 *   pressBoxAt, which finds the marked box a press starts in; and boxInput,
 *   the input a box activates
 * @position Owner of the private press-box attribute. CheckboxInput and
 *   Radio mark their boxes; utils/boxHold.ts reads the mark. No package
 *   entry exports it.
 */

export const PRESS_BOX_ATTRIBUTE = 'data-astryx-press-box'

/** Bound on the box around a control's input and indicator. */
export const pressBoxProps: Readonly<Record<string, string>> = {
  [PRESS_BOX_ATTRIBUTE]: '',
}

/** The marked box that `target` is in, if `surface` contains it. */
export function pressBoxAt(target: EventTarget | null, surface: Element): HTMLElement | null {
  if (!(target instanceof Element))
    return null
  const box = target.closest(`[${PRESS_BOX_ATTRIBUTE}]`)
  return box instanceof HTMLElement && surface.contains(box) ? box : null
}

/**
 * The input `box` activates: the one inside it, else the one its label row
 * controls (a radio's circle sits beside its visually hidden input).
 */
export function boxInput(box: HTMLElement): HTMLInputElement | null {
  const inside = box.querySelector('input')
  if (inside != null)
    return inside
  const label = box.closest('label')
  const control = label?.control ?? (label?.htmlFor ? box.ownerDocument.getElementById(label.htmlFor) : null)
  return control instanceof HTMLInputElement ? control : null
}

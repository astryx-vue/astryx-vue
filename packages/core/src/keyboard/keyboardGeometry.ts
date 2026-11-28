/**
 * @file keyboardGeometry.ts
 * @input Element boxes, computed styles and the layout viewport's height
 * @output The keyboard targets' registry and geometry: where a field's fixed
 *   container meets the keyboard, how far the keyboard covers a bottom edge,
 *   whether the app moves a container itself, and followsKeyboard, the touch
 *   gate
 * @position Keyboard module, internal to core. keyboardRide.ts,
 *   keyboardReveal.ts and keyboardTarget.ts read it.
 */

import type { Animator } from '../motion/animator'
import { isCoarsePointer } from '../utils/coarsePointer'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { nearestScroller } from '../utils/scrollingAncestor'
import { sharedWeakMap, sharedWeakSet } from '../utils/sharedRealm'
import {
  isKeyboardMeasurable,
  isTextEntryControl,
  KEYBOARD_EPSILON,
} from './keyboardHeight'

/**
 * How a target keeps a focused field above the keyboard: `'reveal'` scrolls
 * the field into place, and `'ride'` moves the target with the keyboard.
 */
export type KeyboardMove = 'reveal' | 'ride'

/**
 * The gap a field keeps above the keyboard's top edge, CSS px: the same
 * clearance a layer keeps above the keyboard.
 */
export const FIELD_OFFSET = 10

/**
 * Chrome on Android pans the page itself if the keyboard still covers the
 * focused field about 100 to 170 ms after the report. A field a fraction of a
 * pixel under the keyboard's top still counts as covered. So a show sets the
 * field this far above that top at once, CSS px, and only the rest rides.
 */
export const FIELD_CLEARANCE_AT_REPORT = 4

// Targets that keep their own fields above the keyboard. A field inside one
// moves nothing itself, so nothing moves twice.
const targets = sharedWeakSet<Element>('keyboard/keyboard-target/targets', 1)

/** Registers `element` as a keyboard target until the returned call. */
export function registerKeyboardTarget(element: Element): () => void {
  targets.add(element)
  return () => {
    targets.delete(element)
  }
}

export { nearestScroller }

/** Whether a registered target holds `element`. */
export function isInsideKeyboardTarget(element: Element): boolean {
  for (
    let node = element.parentElement;
    node != null;
    node = node.parentElement
  ) {
    if (targets.has(node)) {
      return true
    }
  }
  return false
}

// The element's bottom edge where layout puts it, without the ride's move.
export function restingBottom(element: Element, animator: Animator): number {
  return element.getBoundingClientRect().bottom - animator.get('y')
}

/**
 * How far a ride has moved `element` from where its layout puts it, as the
 * page draws it now, CSS px. Reading the style creates no animator.
 */
export function drawnOffsetOf(element: Element): number {
  const view = element.ownerDocument.defaultView
  const translate = view?.getComputedStyle(element).translate ?? ''
  return Number.parseFloat(translate.split(' ')[1] ?? '') || 0
}

/** Where an element sits among fixed containers (see fixedContainerOf). */
export type FixedContainer
  = { docked: HTMLElement } | 'fills-viewport' | 'floating' | null

/**
 * How the nearest fixed-position ancestor of `element` meets the keyboard. It
 * is docked when its layout puts its bottom at the layout viewport's bottom
 * edge. It can also fill the viewport, as a dialog does, or float above the
 * bottom edge. Null with no fixed ancestor, as in page content.
 */
export function fixedContainerOf(element: Element): FixedContainer {
  const view = element.ownerDocument.defaultView
  const node = nearestFixedAncestor(element)
  if (view == null || node == null) {
    return null
  }
  const dock = dockOf(node, view)
  return dock === 'docked' ? { docked: node } : dock
}

export function nearestFixedAncestor(element: Element): HTMLElement | null {
  const view = element.ownerDocument.defaultView
  if (view == null) {
    return null
  }
  for (
    let node = element.parentElement;
    node != null;
    node = node.parentElement
  ) {
    if (view.getComputedStyle(node).position === 'fixed') {
      return node
    }
  }
  return null
}

// How far the element's own `transform` moves it down, CSS px: the
// translation of its computed matrix. An app may lift its bar this way.
function transformOffsetOf(element: Element, view: Window): number {
  const transform = view.getComputedStyle(element).transform
  const matrix = /^matrix(3d)?\(([^)]*)\)$/.exec(transform)
  if (matrix == null) {
    return 0
  }
  const values = (matrix[2] ?? '').split(',').map(Number)
  const y = matrix[1] == null ? values[5] : values[13]
  return y != null && Number.isFinite(y) ? y : 0
}

// How a fixed-position `node` meets the keyboard, by its layout box: without
// the ride's translate or any transform the app sets on it.
function dockOf(
  node: HTMLElement,
  view: Window,
): 'docked' | 'fills-viewport' | 'floating' {
  const viewportBottom = layoutViewportHeight(view)
  const box = node.getBoundingClientRect()
  if (box.height >= viewportBottom - KEYBOARD_EPSILON) {
    return 'fills-viewport'
  }
  const bottom
    = box.bottom - drawnOffsetOf(node) - transformOffsetOf(node, view)
  return Math.abs(viewportBottom - bottom) <= KEYBOARD_EPSILON
    ? 'docked'
    : 'floating'
}

// The animator each ridden target moves with. A translate it draws is the
// ride's, not the app's.
export const riddenAnimators = sharedWeakMap<HTMLElement, Animator>(
  'keyboard/keyboard-target/ridden-animators',
  1,
)

// Whether the app positions `node` with its own `translate`, such as `-50% 0`
// to centre it. A translate the ride draws is not the app's.
export function hasOwnTranslate(node: HTMLElement, view: Window): boolean {
  const translate = view.getComputedStyle(node).translate
  if (translate === '' || translate === 'none') {
    return false
  }
  const ride = riddenAnimators.get(node)
  return ride == null || ride.get('y') === 0
}

const POSITION_PROPERTIES = new Set([
  'transform',
  'translate',
  'top',
  'bottom',
  'inset',
  'inset-block',
  'inset-block-start',
  'inset-block-end',
])

const KEYFRAME_FIELDS = new Set([
  'offset',
  'computedOffset',
  'easing',
  'composite',
])

// The CSS properties a running animation changes, in their CSS names.
function animatedProperties(animation: Animation): string[] {
  if ('transitionProperty' in animation) {
    return [String(animation.transitionProperty)]
  }
  const effect = animation.effect
  if (effect == null || !('getKeyframes' in effect)) {
    return []
  }
  const names = new Set<string>()
  for (const frame of (effect as KeyframeEffect).getKeyframes()) {
    for (const key of Object.keys(frame)) {
      if (!KEYFRAME_FIELDS.has(key)) {
        names.add(key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`))
      }
    }
  }
  return [...names]
}

// Whether the app is moving `node` itself right now with a CSS transition or
// animation on its position. A script animation is not seen: an app that moves
// its bar from script keeps it clear with its own `translate`. On a target the
// ride moves, a transition of `translate` alone is the ride's. The target's
// `transition` starts it when the ride writes the property. The app sets no
// `translate` on a target the ride moves.
export function isMovedByApp(node: HTMLElement): boolean {
  if (typeof node.getAnimations !== 'function') {
    return false
  }
  const isRidden = riddenAnimators.has(node)
  return node.getAnimations().some((animation) => {
    if (animation.playState !== 'running') {
      return false
    }
    const isTransition = 'transitionProperty' in animation
    if (!isTransition && !('animationName' in animation)) {
      return false
    }
    const properties = animatedProperties(animation)
    if (
      isRidden
      && isTransition
      && properties.every(property => property === 'translate')
    ) {
      return false
    }
    return properties.some(property => POSITION_PROPERTIES.has(property))
  })
}

export function isDockedContainer(node: HTMLElement): boolean {
  const view = node.ownerDocument.defaultView
  return (
    view != null
    && view.getComputedStyle(node).position === 'fixed'
    && dockOf(node, view) === 'docked'
  )
}

/**
 * The fixed container docked at the viewport's bottom edge that holds
 * `element`, or null. A container that fills the viewport or floats above
 * the bottom edge is never one.
 */
export function dockedAncestor(element: Element): HTMLElement | null {
  const container = fixedContainerOf(element)
  return container != null && typeof container === 'object'
    ? container.docked
    : null
}

/**
 * How far a bottom edge at `bottom` sits under the keyboard's top, plus
 * `offset`, CSS px; 0 when it clears it. An overlap under one CSS px is the
 * viewport's rounding, not an obstruction.
 */
export function coveredBy(
  bottom: number,
  height: number,
  offset: number,
  win: Window,
): number {
  const covered = bottom + offset - (layoutViewportHeight(win) - height)
  return height > 0 && covered > KEYBOARD_EPSILON ? covered : 0
}

export function focusedFieldIn(target: Element): HTMLElement | null {
  const active = target.ownerDocument.activeElement
  return active != null
    && active !== target
    && target.contains(active)
    && isTextEntryControl(active)
    ? active
    : null
}

/**
 * Whether `win` keeps fields above a keyboard at all: a top-level document
 * whose visual viewport shrinks for the keyboard, under a coarse primary
 * pointer.
 */
export function followsKeyboard(win: Window | null): win is Window {
  return win != null && isKeyboardMeasurable(win) && isCoarsePointer(win)
}

/**
 * @file panOptions.ts
 * @input Nothing: types
 * @output PanDirection and PanGestureRecognizerOptions
 * @position Re-exported by PanGestureRecognizer.ts
 */

import type { GestureRecognizerOptions } from './GestureRecognizer'
import type { PanGestureRecognizer } from './PanGestureRecognizer'
import type { GestureTouch } from './types'

export type PanDirection
  = 'any' | 'horizontal' | 'vertical' | 'left' | 'right' | 'up' | 'down'

export interface PanGestureRecognizerOptions extends GestureRecognizerOptions<PanGestureRecognizer> {
  /** @default 1 */
  minimumNumberOfTouches?: number
  /** @default Infinity */
  maximumNumberOfTouches?: number
  /**
   * The travel that begins the pan, px. A function gives each press its own
   * threshold: it reads the press's first touch when that touch lands.
   * @default UIKit's 10
   */
  hysteresis?: number | ((touch: GestureTouch) => number)
  /** Movement that may begin the pan; anything else fails it. @default 'any' */
  direction?: PanDirection
  /**
   * For a pan limited to an axis: how much the movement along the axis must
   * exceed the movement across it to begin. Above 1, movement that is still
   * between the two lines when the pan reaches its hysteresis fails it: a pan
   * that competes with native scrolling decides within 10 px
   * (`spec:AST-094` FR19). Below 1, the pan claims drags up to
   * atan(1 / axisRatio) off its axis.
   * @default 1
   */
  axisRatio?: number
  /**
   * With `direction: 'any'`, report movement along the axis that dominated
   * at the start only (UIScrollView's directional lock).
   */
  lockAxis?: boolean
  /**
   * A trackpad's two-finger scroll (`continuous`) drives the pan where its
   * owner allows it. It moves as a contact with the content, along its own
   * axis, after the scrollers under the pointer. Its own element is the pan's
   * on the axis its `touch-action` keeps, as for a finger. A mouse wheel's
   * notches never drive a pan; they scroll what is under the pointer.
   * @default [] (none)
   */
  allowedScrollTypes?: ReadonlyArray<'continuous'>
  /** Begin only when the native scrollers under the touch are at the edge. */
  scrollEdge?: boolean
  /**
   * A one-way pan decides on the touch's first move. A first move its own way
   * holds the touch from that move. Any other first move fails the pan, so the
   * page keeps the touch. A toast's swipe works this way.
   */
  firstMoveDecides?: boolean
}

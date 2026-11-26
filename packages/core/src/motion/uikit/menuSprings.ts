/**
 * @file menuSprings.ts
 * @input Nothing; data only
 * @output The springs of UIKit's alerts, action sheets, menus and context
 *   menus, each in the vocabulary of its source
 * @position Part of the springs domain of the UIKit constants table:
 *   springs.ts re-exports every row and lists them in `springs`
 */

import { springRole } from '../springRole'

// ---------------------------------------------------------------------
// Alerts, action sheets, menus
// ---------------------------------------------------------------------

/**
 * Alert (UIAlertController .alert) appearing: fades in and scales from
 * 1.2 to 1, the dimming fading in alongside. UIKit asks
 * `UIView.animate(withDuration: 0.404, usingSpringWithDamping: 600,
 * initialSpringVelocity: 0)`; the damping clamps to critical, and the
 * spring settles at 0.404 s.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, UIView.animate hooked and CASpringAnimation dumped
 *   (mass 1, stiffness 522.350, damping 45.710, duration 0.404),
 *   Oct 23 2026
 */
export const ALERT_PRESENT_SPRING = {
  mass: 1,
  stiffness: 522.35,
  damping: 45.71,
} as const

/**
 * Alert dismissing: the same spring, opacity only.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, CASpringAnimation dump, Oct 23 2026
 */
export const ALERT_DISMISS_SPRING = {
  mass: 1,
  stiffness: 522.35,
  damping: 45.71,
} as const

/**
 * Action sheet (UIAlertController .actionSheet) appearing: identical to
 * the alert.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, CASpringAnimation dump, Oct 23 2026
 */
export const ACTION_SHEET_PRESENT_SPRING = {
  mass: 1,
  stiffness: 522.35,
  damping: 45.71,
} as const

/**
 * Action sheet dismissing: identical to the alert.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, CASpringAnimation dump, Oct 23 2026
 */
export const ACTION_SHEET_DISMISS_SPRING = {
  mass: 1,
  stiffness: 522.35,
  damping: 45.71,
} as const

/**
 * UIMenu (from a button) opening; UIKit drives it per frame and lets it
 * track a finger still on the screen.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, `_animateUsingSpringWithDampingRatio:response:tracking:`
 *   hooked (0.8, 0.32, tracking), Oct 23 2026
 */
export const MENU_OPEN_SPRING = /* @__PURE__ */ springRole('menuOpen', {
  response: 0.32,
  dampingRatio: 0.8,
} as const)

/**
 * UIMenu closing (a tap outside).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, the same hook (0.85, 0.35, not tracking), Oct 23 2026
 */
export const MENU_CLOSE_SPRING = /* @__PURE__ */ springRole('menuClose', {
  response: 0.35,
  dampingRatio: 0.85,
} as const)

/**
 * A sub-menu opening in place (its row tapped on a phone): a card laid over
 * the parent's rows from the tapped row grows down to fit the sub-menu, the
 * menu's box with it, and the parent's rows recede, on this spring
 * (spec:AST-094 FR34).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, a pull-down button at y 150 whose menu opens downward
 *   (Alpha, Beta, Sort By ▸ (Name, Date, Size), Delete), every menu label,
 *   image and view read per 60 Hz tick, Oct 24 2026 (t from the tap-down;
 *   the lift at 60 ms): the menu's box kept its top and grew 188 → 190.9
 *   (106 ms), 198.1 (123), 218.1 (156), 238.5 (189), 255.6 (223), 268.2
 *   (256), 276.7 (289), 282.1 (324), 285.2 (359), 286.8 (389), 287.6 (424),
 *   settling at 287.2; the parent rows' opacity followed it (1 → 0.5 by 389
 *   ms). UIKit's own spring for it, logged as the
 *   `UIViewSpringAnimationBehavior` it starts a few ms after the lift on
 *   every sub-menu row (four captures): damping ratio 0.85, response 0.4 s.
 *   It fits the box's eleven frames to 0.12 pt rms of the 99 pt travel
 *   (start 89.5 ms), as a free single-spring fit does (0.86, 0.395)
 */
export const SUB_MENU_OPEN_SPRING = /* @__PURE__ */ springRole('subMenuOpen', {
  response: 0.4,
  dampingRatio: 0.85,
} as const)

/**
 * Back out of a sub-menu (its header tapped): the card shrinks back up into
 * the row, the menu's box with it, and the parent's rows come back, on this
 * spring (spec:AST-094 FR34).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, the same menu and readings, Oct 24 2026 (t from the
 *   tap-down; the lift at 60 ms): the box 287.2 → 284.3 (128 ms), 268.7
 *   (160), 249.9 (195), 233 (228), 219.6 (260), 209.6 (296), 202.5 (329),
 *   197.6 (361), 194.3 (395), 192.1 (428), 189.7 (494), 188 (628); the
 *   parent rows' opacity 0.5 → 0.59 (160), 0.69 (195), 0.77 (228), 0.84
 *   (260), 0.89 (296), 0.93 (329), 0.95 (361), 0.97 (395), 0.99 (461), 1
 *   (527). UIKit's own spring for it, logged as the
 *   `UIViewSpringAnimationBehavior` it starts on every header back (three
 *   captures): damping ratio 1, response 0.4 s. It fits the box's twelve
 *   frames to 0.28 pt rms of the 99 pt travel (start 111 ms), the opacity to
 *   0.0055 rms
 */
export const SUB_MENU_BACK_SPRING = /* @__PURE__ */ springRole('subMenuBack', {
  response: 0.4,
  dampingRatio: 1,
} as const)

/**
 * Context menu (UIContextMenuInteraction): the preview lifting once the
 * long press commits.
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, the same hook (0.8, 0.32, tracking), Oct 23 2026
 */
export const CONTEXT_MENU_LIFT_SPRING = /* @__PURE__ */ springRole(
  'contextMenuLift',
  {
    response: 0.32,
    dampingRatio: 0.8,
  } as const,
)

/**
 * Context menu dismissing (a tap outside).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, the same hook (0.85, 0.35, not tracking), Oct 23 2026
 */
export const CONTEXT_MENU_DISMISS_SPRING = /* @__PURE__ */ springRole(
  'contextMenuDismiss',
  {
    response: 0.35,
    dampingRatio: 0.85,
  } as const,
)

/**
 * Context menu: the menu's entrance beside the lifted preview and the preview
 * shadow's rise and fade (the preview's growth and the backdrop's fade take
 * the lift spring above).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, per-frame morph and platter layers, Oct 23 2026: the menu
 *   content's opacity, blur and scale, the morph container's centre and the
 *   preview shadow's opacity each fit (0.30, 0.80), rms ≤ 0.001; the issued
 *   UIViewSpringAnimationBehaviorSettings are (0.8, 0.3)
 */
export const CONTEXT_MENU_MORPH_SPRING = /* @__PURE__ */ springRole(
  'contextMenuMorph',
  {
    response: 0.3,
    dampingRatio: 0.8,
  } as const,
)

/**
 * What UIKit plays for a menu with Reduce Motion on: critically damped,
 * slower, no overshoot. A reference reading of UIKit only, never played:
 * under reduced motion no core transition springs (`design:reduced-motion`
 * DR1); a touch presentation cross-fades instead (DR2), and nothing opts
 * out (DR4, `spec:AST-094` FR8).
 * @source measured: UIKit lab (injected host app), iOS 26.2 simulator,
 *   iPhone 17 Pro, `_animateUsingSpringWithDampingRatio:response:tracking:`
 *   hooked with Reduce Motion on (1.0, 0.4), Oct 23 2026
 */
export const MENU_REDUCED_MOTION_SPRING = {
  response: 0.4,
  dampingRatio: 1,
} as const

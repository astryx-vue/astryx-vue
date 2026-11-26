/**
 * @file index.ts
 * @input The domain files of the UIKit constants table
 * @output Re-exports `springs` and one constant per spring
 *   (`SHEET_PRESENT_SPRING`, …), and the `scroll`, `timing`, `navigation`,
 *   `picker`, `popover`, `progressBar`, `segmentedControl`, `datePicker`,
 *   `sheet`, `slider`, `switchControl` and `zoomMedia` domains. It also
 *   re-exports a table's reorder (`reorder`), the gesture thresholds (one
 *   `UIKIT_*` group per recognizer and their union `UIKIT_GESTURES`), and the
 *   haptic tables
 * @position Entry of the UIKit constants table (motion/uikit). Internal to
 *   core: not exported from the package entry point
 *
 * THE table (`spec:AST-094` FR1, FR2): every spring, duration, deceleration rate, rubber-band
 * constant, timing curve and gesture threshold a touch presentation uses
 * comes from here, with its source next to it. Components never carry their
 * own numbers.
 */

export { datePicker } from './datePicker'
export {
  type GestureConstant,
  type GestureConstantUnit,
  HAPTIC_FEEDBACK_KINDS,
  HAPTIC_VIBRATION_PATTERNS,
  type HapticFeedbackKind,
  UIKIT_CLICK,
  UIKIT_CONTROL,
  UIKIT_GESTURES,
  UIKIT_LONG_PRESS,
  UIKIT_MENU_PRESS,
  UIKIT_PAN,
  UIKIT_PINCH,
  UIKIT_PRESS,
  UIKIT_ROTATION,
  UIKIT_SCREEN_EDGE_PAN,
  UIKIT_SWIPE,
  UIKIT_TAP,
  UIKIT_VELOCITY,
} from './gestures'
export { navigation, registerNavigationTable } from './navigation'
export { picker } from './picker'
export { popover } from './popover'
export { progressBar, registerProgressBarTable } from './progressBar'
export { reorder } from './reorder'
export { registerScrollTable, scroll } from './scroll'
export { segmentedControl } from './segmented'
export { sheet } from './sheet'
export { slider } from './slider'
export {
  ACTION_SHEET_DISMISS_SPRING,
  ACTION_SHEET_PRESENT_SPRING,
  ALERT_DISMISS_SPRING,
  ALERT_PRESENT_SPRING,
  BANNER_SPRING,
  CONTEXT_MENU_DISMISS_SPRING,
  CONTEXT_MENU_LIFT_SPRING,
  CONTEXT_MENU_MORPH_SPRING,
  DIRECT_CHANGE_SPRING,
  EMPHASIS_SPRING,
  FINGER_TRACKING_SPRING,
  KEYBOARD_SPRING,
  MENU_CLOSE_SPRING,
  MENU_OPEN_SPRING,
  MENU_REDUCED_MOTION_SPRING,
  NAVIGATION_BAR_ELEMENTS_SPRING,
  NAVIGATION_INTERACTIVE_POP_FINISH_SPRING,
  NAVIGATION_POP_SPRING,
  NAVIGATION_PUSH_SPRING,
  QUICK_CHANGE_SPRING,
  registerSpringsTable,
  SETTLE_SPRING,
  SHEET_DETENT_SPRING,
  SHEET_DISMISS_SPRING,
  SHEET_DISMISS_SWIPE_SPRING,
  SHEET_PRESENT_SPRING,
  SHEET_RELEASE_FAST_SPRING,
  springs,
  STATE_CHANGE_SPRING,
  SUB_MENU_BACK_SPRING,
  SUB_MENU_OPEN_SPRING,
  SWITCH_THUMB_MOVE_SPRING,
  TIMED_CHANGE_SPRING,
  VIEW_CHANGE_SPRING,
} from './springs'
export { switchControl } from './switch'
export { registerTimingTable, timing } from './timing'
export { registerZoomMediaTable, zoomMedia } from './zoomMedia'

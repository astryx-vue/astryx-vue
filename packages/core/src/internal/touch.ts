/**
 * @file touch.ts
 * @input core 的手势识别器、动效引擎、UIKit 常量表和几处焦点、指针小工具
 * @output 给本仓库其他包（目前是 lab）用的触屏与动效内部入口
 * @position `@astryx-vue/core/internal/touch` 子路径。不是公开 API：不进主入口，
 *   不写进文档，随时可能变；只服务同仓库、同版本发布的包。
 *
 * 对应上游 `@astryxdesign/core/internal/touch`。公开的 `createAnimator` 只播主题的
 * 状态切换弹簧；lab 组件要按 UIKit 实测的弹簧、手势阈值和「减弱动态效果」规则
 * 还原手感，所以从这里拿动效引擎和手势识别器本身。
 */

export { isFocusLost } from '../composables/internal/focusLeaving'
export { focusForLastInput } from '../composables/internal/focusReturn'
export { getGestureHost } from '../gestures/GestureHost'
export { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
export type { PanGestureRecognizerOptions } from '../gestures/PanGestureRecognizer'
export { ScreenEdgePanGestureRecognizer } from '../gestures/ScreenEdgePanGestureRecognizer'
export type { GestureEventContext, GestureTouch, PointerKind } from '../gestures/types'
export { useFingerScroll } from '../gestures/useFingerScroll'
export type { UseFingerScrollOptions } from '../gestures/useFingerScroll'
export { useGestureRecognizer } from '../gestures/useGestureRecognizer'
export { animatorFor, createMotionEngine } from '../motion/animator'
export type {
  AnimateOptions,
  MotionCurve,
  Animator as MotionEngine,
  AnimatorOptions as MotionEngineOptions,
  MotionHandle,
  SpringTransition,
} from '../motion/animator'
export { cubicBezier } from '../motion/bezier'
export { mapProgress } from '../motion/progress'
export { reducedMotionFade } from '../motion/reducedMotion'
export { resolveMotion } from '../motion/resolveMotion'
export { parseCssEasing, parseMotionRoleValue } from '../motion/roles'
export { rubberBand, rubberBandInverse, rubberBandSlope } from '../motion/rubberBand'
export { solveSpring, toSpring } from '../motion/spring'
export type { SpringDescription } from '../motion/spring'
export { UIKIT_GESTURES } from '../motion/uikit/gestures'
export { navigation } from '../motion/uikit/navigation'
export { scroll } from '../motion/uikit/scroll'
export {
  NAVIGATION_BAR_ELEMENTS_SPRING,
  NAVIGATION_INTERACTIVE_POP_FINISH_SPRING,
  NAVIGATION_POP_SPRING,
  NAVIGATION_PUSH_SPRING,
} from '../motion/uikit/springs'
export { timing } from '../motion/uikit/timing'
export { isCoarsePointer } from '../utils/coarsePointer'
export { isRtlElement } from '../utils/isRtlElement'
export { observeResize } from '../utils/sharedResizeObserver'
export { TOUCH_QUERY } from '../utils/touchQueries'

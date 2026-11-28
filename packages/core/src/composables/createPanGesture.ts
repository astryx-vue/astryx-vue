/**
 * 公开的拖动手势工厂。实现在 `gestures/createPanGesture.ts`，这里只转出
 * 公开的 `createPanGesture` 和它的类型；组件内部用的 `createPan` 不从包里导出。
 */
export { createPanGesture } from '../gestures/createPanGesture'
export type {
  PanGesture,
  PanGestureEvent,
  PanGestureOptions,
  PanGestureState,
} from '../gestures/createPanGesture'

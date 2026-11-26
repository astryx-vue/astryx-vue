/**
 * 公开的吸附点拖动工厂。实现在 `dragToSnapPoints/createDragToSnapPoints.ts`，
 * 这里只转出公开的 `createDragToSnapPoints` 和它的类型；组件内部用的
 * `createSnapDrag` 不从包里导出。
 */
export { createDragToSnapPoints } from '../dragToSnapPoints/createDragToSnapPoints'
export type {
  DragToSnapPoints,
  DragToSnapPointsOptions,
} from '../dragToSnapPoints/createDragToSnapPoints'

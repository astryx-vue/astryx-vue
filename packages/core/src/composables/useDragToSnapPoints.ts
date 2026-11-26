import type { MaybeRefOrGetter } from 'vue'
import type { DragToSnapPoints, DragToSnapPointsOptions } from '../dragToSnapPoints/createDragToSnapPoints'
import { createDragToSnapPoints } from '../dragToSnapPoints/createDragToSnapPoints'
import { useAttachment } from '../gestures/useAttachment'

export interface UseDragToSnapPointsResult {
  /** 不经过拖动，把元素移到第 `index` 个吸附点（给键盘用）。始终是同一个函数。 */
  readonly settleTo: (index: number) => void
}

/**
 * 让 `target` 指向的元素能沿 `axis` 拖动，松手后停到 `snapPoints` 里的一个点上。
 * `target` 可以是模板 ref、getter 或元素本身。
 *
 * 拖动跟着 `target` 当前指向的元素走，元素换掉就挂到新元素上，作用域销毁时拆掉。
 * `options` 是响应式对象时，`axis`、`snapPoints`、`flickThreshold` 变了就重建拖动，
 * 元素停在原处（正在进行的回弹也一样）；内容相同的新数组不会重建。`onSettle`
 * 每次停稳时才从 `options` 里读，换一个新函数不会重建。服务端渲染时不碰 DOM。
 *
 * @example
 * ```ts
 * const drawer = useTemplateRef<HTMLElement>('drawer')
 * const index = ref(0)
 * const { settleTo } = useDragToSnapPoints(drawer, {
 *   axis: 'y',
 *   snapPoints: [0, 240, 480],
 *   onSettle: (next) => { index.value = next },
 * })
 * ```
 */
export function useDragToSnapPoints(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: DragToSnapPointsOptions,
): UseDragToSnapPointsResult {
  let current: DragToSnapPoints | null = null
  // The snap points as a value, so a new array with the same points keeps
  // the drag (an empty list stays empty).
  const points = (): string => JSON.stringify(options.snapPoints)
  useAttachment(
    target,
    (element) => {
      const snap = createDragToSnapPoints(element, {
        axis: options.axis,
        snapPoints: JSON.parse(points()) as number[],
        flickThreshold: options.flickThreshold,
        onSettle: index => options.onSettle(index),
      })
      current = snap
      return () => {
        snap.destroy()
        if (current === snap)
          current = null
      }
    },
    // A new axis, snap points or flick speed creates the drag again.
    () => `${options.axis} ${points()} ${options.flickThreshold ?? ''}`,
  )
  return {
    settleTo: index => current?.settleTo(index),
  }
}

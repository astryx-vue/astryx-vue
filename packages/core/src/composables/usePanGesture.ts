import type { MaybeRefOrGetter } from 'vue'
import type { PanGestureOptions } from '../gestures/createPanGesture'
import { createPanGesture } from '../gestures/createPanGesture'
import { useAttachment } from '../gestures/useAttachment'

/**
 * 把 `target` 指向的元素上的拖动报成数值。`target` 可以是模板 ref、getter
 * 或元素本身。
 *
 * 元素上始终只有一个拖动手势：换了元素、或 `options` 是响应式对象且 `axis`
 * 变了，就重建；作用域销毁时拆掉。`onPan` 每次报告时才从 `options` 里读，
 * 换一个新函数不会重建手势。拖动过程中不触发组件重新渲染。正在进行的拖动遇到
 * 重建或卸载时直接结束，不再调 `onPan`。服务端渲染时不碰 DOM。
 *
 * @example
 * ```ts
 * const card = useTemplateRef<HTMLElement>('card')
 * usePanGesture(card, {
 *   axis: 'x',
 *   onPan: ({ state, translation }) => {
 *     card.value!.style.translate = state === 'changed' ? `${translation.x}px` : ''
 *   },
 * })
 * ```
 */
export function usePanGesture(
  target: MaybeRefOrGetter<Element | null | undefined>,
  options: PanGestureOptions,
): void {
  useAttachment(
    target,
    (element) => {
      let isForwarding = true
      const gesture = createPanGesture(element, {
        axis: options.axis,
        onPan: (event) => {
          if (isForwarding)
            options.onPan(event)
        },
      })
      return () => {
        isForwarding = false
        gesture.destroy()
      }
    },
    () => options.axis,
  )
}

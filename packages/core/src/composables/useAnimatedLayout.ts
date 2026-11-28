import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import type { AnimatedLayout } from '../motion/layout'
import { toValue } from 'vue'
import { createAnimatedLayout } from '../motion/layout'

export type { AnimatedLayout } from '../motion/layout'

export interface UseAnimatedLayoutOptions {
  /**
   * 内容在里面滑动的容器：滚动容器或面板。可以是模板 ref、getter 或元素本身；
   * 给组件实例时取它的根元素。
   */
  containerRef: MaybeRefOrGetter<Element | ComponentPublicInstance | null | undefined>
}

function elementOf(value: Element | ComponentPublicInstance | null | undefined): Element | null {
  if (value == null)
    return null
  if (typeof Element !== 'undefined' && value instanceof Element)
    return value
  const root = (value as ComponentPublicInstance).$el as unknown
  return typeof Element !== 'undefined' && root instanceof Element ? root : null
}

/**
 * 返回一个句柄，交给尺寸会变的组件（例如 TreeList、Collapsible）。组件尺寸变化时，
 * 它和 `containerRef` 里排在它后面的内容按同一条动效一起滑到新位置。固定定位和吸住的
 * 粘性元素不动，滑动从不滚动容器，并遵从「减少动态效果」。
 *
 * 容器在变化发生时才读，所以句柄只创建一次，之后 ref 指向别的元素也能读到。
 * 句柄没有公开成员。服务端渲染时不碰 DOM。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAnimatedLayout } from '@astryx-vue/core'
 * import { useTemplateRef } from 'vue'
 *
 * const container = useTemplateRef<HTMLElement>('container')
 * const animatedLayout = useAnimatedLayout({ containerRef: container })
 * </script>
 *
 * <template>
 *   <div ref="container">
 *     <TreeList :items="items" :animated-layout="animatedLayout" />
 *     <p>备注</p>
 *   </div>
 * </template>
 * ```
 */
export function useAnimatedLayout({ containerRef }: UseAnimatedLayoutOptions): AnimatedLayout {
  return createAnimatedLayout(() => elementOf(toValue(containerRef)))
}

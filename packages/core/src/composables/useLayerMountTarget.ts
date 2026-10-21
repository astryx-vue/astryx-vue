import type { ComputedRef, Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import { layerMountKey, resolveLayerMountTarget } from '../layer/mount.js'

/**
 * 读最近的浮层挂载点。Dialog 打开时是它内部的挂载点，其余情况是 `null`。
 *
 * 挂载点是「浮层内容实际挂到哪个 DOM 元素里」。浮层平时挂在 `body`，
 * 但 Dialog 打开时它是一个原生模态层，挂在外面的浮层会被压住、点不到，
 * 所以要先问一句。
 */
export function useLayerMountTarget(): Readonly<Ref<HTMLElement | null>> {
  return inject(layerMountKey, ref(null))
}

/**
 * 读最近的浮层挂载点，并算成可以直接给 `Teleport` 的 `to`。
 * 没有挂载点就是 `'body'`。
 *
 * ```vue
 * <Teleport :to="teleportTarget">
 * ```
 */
export function useLayerTeleportTarget(): ComputedRef<string | HTMLElement> {
  const mount = useLayerMountTarget()
  return computed(() => mount.value ?? 'body')
}

/**
 * 浮层该挂到哪。
 *
 * Dialog 提供了挂载点时优先用它，再往外挂就出了模态层。
 * 否则看触发器旁边有没有不能挂浮层的祖先（段落、链接、按钮）。
 * 有的话挂到那个祖先的外面、尽量靠近原位，嵌套主题和 Tab 顺序还在。
 * 两边都没有，才挂到 `body`。
 *
 * `sentinel` 是触发器所在的元素。函数看的是它的父元素。
 */
export function useResolvedLayerTeleport(sentinel: Ref<HTMLElement | null>): ComputedRef<string | HTMLElement> {
  const mount = useLayerMountTarget()
  return computed(() => {
    if (mount.value)
      return mount.value
    const corrected = resolveLayerMountTarget(sentinel.value?.parentElement ?? null)
    return corrected ?? 'body'
  })
}

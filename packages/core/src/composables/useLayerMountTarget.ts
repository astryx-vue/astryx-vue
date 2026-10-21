import type { ComputedRef, Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import { layerMountKey } from '../layer/mount.js'

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

import type { MaybeRefOrGetter } from 'vue'
import type { ScrollbarsHandle, UseScrollbarsOptions, UseScrollbarsResult } from './types.js'
import { inject, onScopeDispose, readonly, shallowRef, toValue, watch } from 'vue'
import { scrollbarsKey } from './context.js'

/**
 * 给一个滚动容器挂上自绘滚动条。
 *
 * 外层没有 `ScrollbarsProvider` 时，或者在服务端渲染时，什么都不做，也不建任何 watcher。
 * 容器本身就是视口，所以容器的 overflow 怎么变，滚动条就怎么跟。
 */
export function useScrollbars(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseScrollbarsOptions = {},
): UseScrollbarsResult {
  const ctx = inject(scrollbarsKey, null)
  const active = shallowRef(false)
  if (!ctx || typeof HTMLElement === 'undefined')
    return { active: readonly(active) }

  let handle: ScrollbarsHandle | null = null

  function release(): void {
    handle?.destroy()
    handle = null
    active.value = false
  }

  watch(
    [
      () => toValue(target),
      () => ctx.enabled.value && (toValue(options.enabled) ?? true),
    ],
    ([element, enabled]) => {
      release()
      if (enabled && element instanceof HTMLElement) {
        handle = ctx.mount(element, ctx.options.value)
        active.value = true
      }
    },
    { immediate: true, flush: 'post' },
  )

  watch(ctx.options, next => handle?.update(next), { deep: true })

  onScopeDispose(release)

  return { active: readonly(active) }
}

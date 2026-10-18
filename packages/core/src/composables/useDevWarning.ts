import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'

/** 生产构建里 `import.meta.env.DEV` 是 false，这两个函数整段会被摇掉。 */
function isDevBuild(): boolean {
  return (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
}

/**
 * 对应原版 Astryx 的 `devWarn`。
 *
 * 没有组件实例时用的开发期警告，只在开发构建里输出。
 * 输出形如 `Component: message`，前缀写组件或组合式函数的名字。
 */
export function devWarn(component: string, message: string): void {
  if (!isDevBuild())
    return
  console.warn(`${component}: ${message}`)
}

/**
 * 对应原版 Astryx 的 `hooks/useDevWarning`。
 *
 * 条件成立时打一条开发期警告，同一次挂载只打一次。
 * 直接写在渲染体里的警告每次渲染都会重来，用状态挡又白白多一次渲染，
 * 所以这里靠 watch 在条件第一次成立时打一次。
 *
 * 生产构建里什么也不做，不会输出，也不留 watcher。
 */
export function useDevWarning(
  component: string,
  message: string,
  condition: MaybeRefOrGetter<boolean> = true,
): void {
  if (!isDevBuild())
    return

  let isWarned = false
  watch(() => toValue(condition), (holds) => {
    if (!holds || isWarned)
      return
    isWarned = true
    devWarn(component, message)
  }, { immediate: true })
}

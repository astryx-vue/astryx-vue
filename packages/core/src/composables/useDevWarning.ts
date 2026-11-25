import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'
import { isDevBuild } from './internal/devBuild.js'

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
 * 对应原版 Astryx 的 `devPropError`。
 *
 * 开发构建里，属性用错时直接抛出一条点名属性、给出改法的错误，
 * 免得错误从组件内部以 TypeError 的样子冒出来。生产构建里什么也不做。
 */
export function assertDevProp(condition: boolean, component: string, prop: string, message: string): void {
  if (!isDevBuild() || condition)
    return
  throw new Error(`${component}: \`${prop}\` ${message}`)
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

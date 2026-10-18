import type { ComponentPublicInstance, Ref } from 'vue'

/** 可以交给 `useMergedRefs` 的目标：一个 `Ref`、一个函数 ref，或空着不填。 */
export type MergedRef<T> = Ref<T | null> | ((value: T | null) => void) | null | undefined

/** 合并出来的函数 ref。模板里的 `:ref` 收到的值是元素或组件实例。 */
export type MergedRefHandle = (value: Element | ComponentPublicInstance | null) => void

/**
 * 对应原版 Astryx 的 `hooks/useMergedRefs`。
 *
 * 把多个 `Ref` 和函数 ref 合成一个函数 ref，交给模板的 `:ref`。
 * 组件既要往外转发使用者给的 ref，又要自己留一份内部 ref 时用得上。
 *
 * 返回的函数在组合式函数的生命周期里只有一份。直接在模板里写
 * `:ref="value => { ... }"` 每次渲染都会造一个新函数，Vue 会先解绑再重新绑定，
 * 白白多做一轮解绑和挂载。
 */
export function useMergedRefs<T = Element>(refs: readonly MergedRef<T>[]): MergedRefHandle {
  return function mergedRef(value: Element | ComponentPublicInstance | null): void {
    for (const target of refs) {
      if (target == null)
        continue
      if (typeof target === 'function')
        target(value as T | null)
      else
        target.value = value as T | null
    }
  }
}

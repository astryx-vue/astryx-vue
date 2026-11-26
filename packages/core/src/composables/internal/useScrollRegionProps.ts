import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, onScopeDispose, shallowRef, toValue, watch } from 'vue'
import { observeMainOverflow } from './mainOverflow.js'

export interface ScrollRegionOptions {
  /** 区域元素，用来观察它有没有溢出。 */
  target: Ref<HTMLElement | null>
  /** 区域本身能不能滚（`overflow: auto`）。 */
  isScrollable: MaybeRefOrGetter<boolean>
  /** 调用方给的角色。它永远优先，也不带默认名字。 */
  role?: MaybeRefOrGetter<string | undefined>
  /** 调用方给的名字。它永远优先。 */
  label?: MaybeRefOrGetter<string | undefined>
  /** 没有 `label` 时区域滚动期间的名字，已翻译。 */
  defaultLabel: MaybeRefOrGetter<string>
}

export interface ScrollRegionProps {
  role: ComputedRef<string | undefined>
  ariaLabel: ComputedRef<string | undefined>
}

/**
 * 可滚动区域的角色和名字。区域能滚而且内容真的溢出时，它是一个 `group`，
 * 名字取调用方的 `label`，没有就取翻译过的「内容」：读屏到达它（包括浏览器给它的 Tab 停靠点）时能读出来。
 * 调用方自己给了 `role` 就只带调用方的 `label`，单个 `main` 地标只靠角色。
 * 区域不滚时，调用方的 `role` 和 `label` 原样交出去。
 */
export function useScrollRegionProps(options: ScrollRegionOptions): ScrollRegionProps {
  const overflows = shallowRef(false)
  const hasRole = computed(() => toValue(options.role) != null)

  watch([options.target, () => toValue(options.isScrollable), hasRole], ([node, scrollable, roleGiven], _previous, onCleanup) => {
    overflows.value = false
    if (node == null || !scrollable || roleGiven)
      return
    onCleanup(observeMainOverflow(node, (next) => {
      overflows.value = next
    }))
  }, { flush: 'post', immediate: true })
  onScopeDispose(() => {
    overflows.value = false
  })

  const isGroup = computed(() => !hasRole.value && toValue(options.isScrollable) && overflows.value)
  return {
    ariaLabel: computed(() => toValue(options.label) ?? (isGroup.value ? toValue(options.defaultLabel) : undefined)),
    role: computed(() => toValue(options.role) ?? (isGroup.value ? 'group' : undefined)),
  }
}

import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/** 多态组件最后该渲染成什么。 */
export type InteractiveRole = 'link' | 'button' | 'inert'

export interface UseInteractiveRoleOptions {
  /** 地址。优先级最高：有它就渲染成链接。 */
  href?: MaybeRefOrGetter<string | undefined>
  /**
   * 有没有点击处理函数。没有地址时，有它就渲染成按钮。
   *
   * 上游直接看 `onClick` 有没有值。Vue 里「函数」和「取值函数」分不开，
   * 传一个 `() => props.onClick` 会被当场调用掉，所以这里改收一个布尔，
   * 由调用方写清楚自己有没有监听点击。
   */
  hasOnClick?: MaybeRefOrGetter<boolean>
  /**
   * 停用时不看 `href`，因为停用的链接本身就不该是链接。
   * 这时角色从 `onClick` 往下找，都没有就是 `inert`。
   * @default false
   */
  isDisabled?: MaybeRefOrGetter<boolean>
}

export interface UseInteractiveRoleReturn {
  /** 组件该渲染的元素：`a`、`button`，还是不带交互的 `span` / `div`。 */
  role: ComputedRef<InteractiveRole>
}

/**
 * 对应原版 Astryx 的 `hooks/useInteractiveRole`。
 *
 * 把「这个多态组件到底渲染成什么」收在一处决定：有 `href` 就是链接，
 * 没 `href` 但有 `onClick` 就是按钮，都没有就是一段普通内容。
 * 时而是链接、时而按钮、时而是纯内容的组件都该走这里，判断先后顺序才不会各写一套。
 *
 * 只有 `link` 才真的渲染 `a`，这样键盘、中键新开标签这些行为都是浏览器给的。
 *
 * 上游还会读父级给的「触发上下文」（Popover、DropdownMenu 之类），
 * 让组件自动成为新浮层的合法触发器。我们的浮层不支持子元素当触发器，
 * 没有这份上下文可读，所以这里停在 `onClick` 这一层。
 */
export function useInteractiveRole(options: UseInteractiveRoleOptions): UseInteractiveRoleReturn {
  const role = computed<InteractiveRole>(() => {
    const href = toValue(options.href)
    if (!toValue(options.isDisabled ?? false) && href != null && href !== '')
      return 'link'
    if (toValue(options.hasOnClick ?? false))
      return 'button'
    return 'inert'
  })

  return { role }
}

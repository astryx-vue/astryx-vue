import type { ComputedRef } from 'vue'
import { computed, getCurrentInstance } from 'vue'

function wasPropPassed(name: string): boolean {
  const raw = getCurrentInstance()?.vnode.props
  if (raw == null)
    return false
  if (Object.hasOwn(raw, name))
    return true
  const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  return Object.hasOwn(raw, kebab)
}

/**
 * 隐藏标签的正名是 `isLabelHidden`，旧名 `labelHidden` 先留着。
 *
 * 默认不隐藏时，两个名字任一为真就隐藏。Vue 会把没传的布尔属性当成 false，
 * 这种默认值用「或」就够了。
 *
 * 默认隐藏（PowerSearch）时必须分清「没传」和「传了 false」。
 * 两个都传了，听正名。这个判断要在 setup 里做：渲染函数里拿不到当前实例。
 */
export function useResolvedLabelHidden(
  isLabelHidden: () => boolean | undefined,
  labelHidden: () => boolean | undefined,
  fallback = false,
): ComputedRef<boolean> {
  if (!fallback)
    return computed(() => Boolean(isLabelHidden()) || Boolean(labelHidden()))

  const passedNew = wasPropPassed('isLabelHidden')
  const passedOld = wasPropPassed('labelHidden')
  return computed(() => {
    if (passedNew)
      return Boolean(isLabelHidden())
    if (passedOld)
      return Boolean(labelHidden())
    return true
  })
}

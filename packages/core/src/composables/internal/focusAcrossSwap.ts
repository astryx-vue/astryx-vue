import { nextTick, watch } from 'vue'

/**
 * 切换 `swapped` 会让 `root` 里某个元素被换成另一个元素（比如禁用后用普通
 * `<a>` 代替路由链接组件）。切换前焦点就在它身上的话，换完后把焦点交给新元素，
 * 不让它掉回页面；焦点本来在别处则不去抢。
 */
export function useFocusAcrossSwap(
  root: () => HTMLElement | null | undefined,
  selector: string,
  swapped: () => boolean,
): void {
  watch(swapped, () => {
    const before = root()?.querySelector(selector) ?? null
    if (before == null || before.ownerDocument.activeElement !== before)
      return
    void nextTick(() => {
      const after = root()?.querySelector<HTMLElement>(selector)
      if (after != null && after !== before)
        after.focus({ preventScroll: true })
    })
  }, { flush: 'pre' })
}

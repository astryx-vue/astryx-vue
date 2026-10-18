import type { MaybeRefOrGetter, Ref } from 'vue'
import { toValue } from 'vue'
import '../../styles/indicator-focus-ring.css'

export interface UseIndicatorFocusRingOptions {
  /** 只包住指示器的那个元素。它的第一个子元素就是要画环的东西。 */
  containerRef: Ref<HTMLElement | null>
  /**
   * 控件被停用时跳过焦点环，因为停用的控件本来就接不到焦点。
   * @default false
   */
  isDisabled?: MaybeRefOrGetter<boolean>
}

export interface IndicatorFocusRingHandlers {
  onFocus: (event: FocusEvent) => void
  onBlur: () => void
}

export interface UseIndicatorFocusRingReturn {
  /** 铺到拿着真正输入框的那个元素上，不要铺在输入框本身。 */
  focusProps: IndicatorFocusRingHandlers
}

/** 读不到 `:focus-visible` 时宁可按可见处理，不能把焦点环弄丢（WCAG 2.4.7）。 */
function isFocusVisible(target: Element): boolean {
  try {
    return target.matches(':focus-visible')
  }
  catch {
    return true
  }
}

/**
 * 对应原版 Astryx 的 `hooks/useIndicatorFocusRing`。
 *
 * 给「真输入框藏起来、画面上的图形代替它」的控件画标准焦点环：复选框、
 * 单选框都把真正的 input 设成透明，焦点环只能画在旁边那个图形上。
 *
 * 环画在指示器自己的元素上，只有这个元素自己的圆角能决定环的形状；
 * 而且只在 `:focus-visible` 时画，鼠标点一下不会亮。统一放在这里管，
 * 主题换掉指示器也照样有可见焦点，不会因为漏了一个属性就整块没法用键盘。
 */
export function useIndicatorFocusRing(options: UseIndicatorFocusRingOptions): UseIndicatorFocusRingReturn {
  function indicator(): HTMLElement | null {
    const child = options.containerRef.value?.firstElementChild
    return child instanceof HTMLElement ? child : null
  }

  /** 标记属性 `data-astryx-focus-ring` 的画法是 `styles/indicator-focus-ring.css`。 */
  function clear(): void {
    const element = indicator()
    if (element != null)
      delete element.dataset.astryxFocusRing
  }

  function onFocus(event: FocusEvent): void {
    if (toValue(options.isDisabled ?? false)) {
      clear()
      return
    }
    const target = event.target
    if (!(target instanceof Element) || !isFocusVisible(target)) {
      clear()
      return
    }
    const element = indicator()
    if (element != null)
      element.dataset.astryxFocusRing = ''
  }

  function onBlur(): void {
    clear()
  }

  return { focusProps: { onFocus, onBlur } }
}

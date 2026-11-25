import type { Ref } from 'vue'
import { onScopeDispose, shallowRef } from 'vue'

/** 和 Tooltip 默认的悬停延迟一致。 */
const HOVER_DELAY = 200

export interface ClampTooltip {
  /** 提示是否已挂载。挂上后一直留着，之后的悬停、聚焦由 Tooltip 自己处理。 */
  isMounted: Readonly<Ref<boolean>>
  onPointerenter: (event: PointerEvent) => void
  onPointerleave: () => void
  onPointerdown: (event: PointerEvent) => void
  onFocusin: (event: FocusEvent) => void
}

function matchesFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}

/**
 * 被截断的 LineClamp 不随内容一起挂提示，等第一次交互才挂，一页截断内容加载时不挂任何提示层。
 * 挂上时就是打开的：鼠标停够悬停延迟才挂，轻点和键盘聚焦立刻挂。
 * 鼠标在延迟内离开或按下就不挂，和挂好的提示一样。
 */
export function useClampTooltip(isEnabled: () => boolean): ClampTooltip {
  const isMounted = shallowRef(false)
  let hoverTimer: ReturnType<typeof setTimeout> | undefined

  function cancelHover(): void {
    clearTimeout(hoverTimer)
    hoverTimer = undefined
  }

  function mount(): void {
    cancelHover()
    if (isEnabled())
      isMounted.value = true
  }

  onScopeDispose(cancelHover)

  return {
    isMounted,
    onPointerenter(event) {
      if (isMounted.value || event.pointerType === 'touch' || !isEnabled())
        return
      cancelHover()
      hoverTimer = setTimeout(mount, HOVER_DELAY)
    },
    onPointerleave: cancelHover,
    onPointerdown(event) {
      if (isMounted.value)
        return
      if (event.pointerType === 'touch')
        mount()
      else
        cancelHover()
    },
    onFocusin(event) {
      const target = event.target
      if (isMounted.value || !(target instanceof Element) || !matchesFocusVisible(target))
        return
      mount()
    },
  }
}

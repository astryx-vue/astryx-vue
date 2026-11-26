import { focusElement, getFocusables } from '../layer/focus.js'

/**
 * 提示视口的焦点交接。
 *
 * 焦点从外面进到视口里（Tab 或点击）时，记住它从哪来。某张提示开始离场而焦点
 * 还在它里面时，焦点交给还留着的提示里的第一个控件；一张都不剩，就还给进来之前的元素，
 * 不让焦点掉到 body 上。
 */
export interface ToastFocusHandoff {
  onFocusIn: (event: FocusEvent) => void
  /** 提示 `id` 开始离场。焦点在它里面时交出去，否则什么也不做。 */
  handoff: (id: string) => void
}

export function createToastFocusHandoff(getViewport: () => HTMLElement | null): ToastFocusHandoff {
  let previous: HTMLElement | null = null

  return {
    onFocusIn(event) {
      const viewport = getViewport()
      const from = event.relatedTarget
      if (viewport != null && from instanceof HTMLElement && !viewport.contains(from))
        previous = from
    },
    handoff(id) {
      const viewport = getViewport()
      if (viewport == null)
        return
      const all = [...viewport.querySelectorAll<HTMLElement>('[data-toast-id]')]
      const index = all.findIndex(row => row.dataset.toastId === id)
      const row = all[index]
      if (row == null || !row.contains(viewport.ownerDocument.activeElement))
        return
      // 先看后面的提示，再看前面的；离场中的不接。
      const neighbors = [...all.slice(index + 1), ...all.slice(0, index).reverse()]
        .filter(candidate => !candidate.hasAttribute('data-toast-exiting'))
      for (const neighbor of neighbors) {
        const target = getFocusables(neighbor)[0]
        if (target != null && focusElement(target))
          return
      }
      if (previous?.isConnected)
        previous.focus({ preventScroll: true })
    },
  }
}

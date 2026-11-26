import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'

/** 名字来自内容的控件。 */
const NAMED_FROM_CONTENT = 'button,summary,a[href],[role=button],[role=link],[role=tab],[role^=menuitem],[role=option],[role=radio],[role=checkbox],[role=switch],[role=treeitem]'

/**
 * `focused` 是不是时间本身，或者是名字有这段时间参与的控件：
 * 没有自己名字、名字来自内容的控件，或者包着这段时间的 label 所指的控件。
 * 只是装着这段时间的日志、滚动区域不算。
 */
export function focusIsNamedBy(time: HTMLElement, focused: Element | null): boolean {
  if (focused == null)
    return false
  if (focused === time)
    return true
  if (focused.contains(time) && focused.matches(NAMED_FROM_CONTENT) && !focused.matches('[aria-label],[aria-labelledby]'))
    return true
  return time.closest('label')?.control === focused
}

/**
 * 实时刷新的相对时间：时间本身，或者名字有它参与的控件拿着焦点时，刷新先等着，
 * 免得控件名字里的字在读屏眼皮底下一直变，名字也不再包含它看得见的字。
 * 焦点离开时补一次刷新。返回的函数在每次刷新前问一句现在能不能刷。
 */
export function useRefreshHold(time: Ref<HTMLElement | null>, isActive: () => boolean, onRelease: () => void): () => boolean {
  let isHeld = false
  let stop: (() => void) | null = null

  function release(): void {
    stop?.()
    stop = null
    isHeld = false
  }

  watch([time, isActive], ([element, active]) => {
    release()
    const doc = element?.ownerDocument
    if (!active || element == null || doc == null)
      return
    const sync = (): void => {
      const holds = focusIsNamedBy(element, doc.activeElement)
      const wasHeld = isHeld
      isHeld = holds
      if (wasHeld && !holds)
        onRelease()
    }
    sync()
    doc.addEventListener('focusin', sync)
    doc.addEventListener('focusout', sync)
    stop = () => {
      doc.removeEventListener('focusin', sync)
      doc.removeEventListener('focusout', sync)
    }
  }, { immediate: true, flush: 'post' })

  onBeforeUnmount(release)
  return () => isHeld
}

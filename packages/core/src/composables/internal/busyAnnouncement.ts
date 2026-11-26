import type { MaybeRefOrGetter } from 'vue'
import type { AnnounceReceipt } from './announceChannel.js'
import { onScopeDispose, toValue, watch } from 'vue'
import { useAnnouncer } from './announce.js'

/**
 * 忙碌控件的读屏播报。
 *
 * 控件里的 Spinner 只是装饰（`aria-hidden`，没有 live 角色），忙碌由控件自己播报：
 * 每次进入忙碌念一次，重渲染不重复，忙完再忙会再念。
 *
 * 原生模态对话框打开时，挂在 body 上的公共播报区域被挡在外面，读屏念不到：
 * 传了 `element` 就写进它所在的那个对话框里的播报区域。路线在下一帧再选，
 * 同一轮里打开的对话框要等它自己的 `showModal()` 跑完。
 *
 * 返回的函数在控件要播报这次忙碌的结果时调用：还没念出去的忙碌开始随即收回，
 * 不会跟在结果后面、或者和结果念成一句（「Loading」念在已经出来的结果之后是假的）。
 * 同一次忙碌里不会再补念。
 */
export function useBusyAnnouncement(
  busy: MaybeRefOrGetter<boolean>,
  message: MaybeRefOrGetter<string>,
  element?: MaybeRefOrGetter<Element | null | undefined>,
): () => void {
  const announce = useAnnouncer()
  let frame: number | null = null
  let receipt: AnnounceReceipt | null = null
  let isSettled = false

  function cancel(): void {
    if (frame != null && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
    frame = null
  }

  function speak(): void {
    receipt = announce(toValue(message), 'polite', { within: element == null ? null : toValue(element) })
  }

  /** 这次忙碌的结果要播报了：没念出去的开始收回，之后也不再补念。 */
  function settle(): void {
    isSettled = true
    cancel()
    receipt?.withdraw()
    receipt = null
  }

  watch(() => toValue(busy), (isBusy) => {
    cancel()
    receipt = null
    isSettled = false
    if (!isBusy)
      return
    if (element == null || typeof requestAnimationFrame !== 'function') {
      speak()
      return
    }
    frame = requestAnimationFrame(() => {
      frame = null
      if (!isSettled)
        speak()
    })
  }, { immediate: true })

  onScopeDispose(cancel)
  return settle
}

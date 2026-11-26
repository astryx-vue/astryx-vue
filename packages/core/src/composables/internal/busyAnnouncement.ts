import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, toValue, watch } from 'vue'
import { useAnnounce } from './announce.js'

/**
 * 忙碌控件的读屏播报。
 *
 * 控件里的 Spinner 只是装饰（`aria-hidden`，没有 live 角色），忙碌由控件自己播报：
 * 每次进入忙碌念一次，重渲染不重复，忙完再忙会再念。
 *
 * 原生模态对话框打开时，挂在 body 上的公共播报区域被挡在外面，读屏念不到。
 * 这时改用对话框里一块常驻的 polite 区域：先空着插进去，下一帧再写字。
 */

const REGION_ATTR = 'data-astryx-modal-busy-region'
const VISUALLY_HIDDEN_CSS = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;'
/** 和公共播报区域的清空时间一致。 */
const CLEAR_DELAY_MS = 2000

interface PendingWrite {
  frame: number
  timer?: ReturnType<typeof setTimeout>
}

/** 每块对话框区域还没落地的写入和清空。新写入会取消它们，旧文字不会晚到，也不会清掉新文字。 */
const pendingByRegion = new WeakMap<HTMLElement, PendingWrite>()

function announceInModal(dialog: HTMLDialogElement, message: string): void {
  let region = dialog.querySelector<HTMLElement>(`:scope > [${REGION_ATTR}]`)
  if (region == null) {
    region = document.createElement('div')
    region.setAttribute(REGION_ATTR, '')
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.style.cssText = VISUALLY_HIDDEN_CSS
    dialog.appendChild(region)
  }
  const target = region
  const previous = pendingByRegion.get(target)
  if (previous != null) {
    cancelAnimationFrame(previous.frame)
    clearTimeout(previous.timer)
  }
  target.textContent = ''
  const pending: PendingWrite = { frame: 0 }
  pending.frame = requestAnimationFrame(() => {
    target.textContent = message
    pending.timer = setTimeout(() => {
      target.textContent = ''
      pendingByRegion.delete(target)
    }, CLEAR_DELAY_MS)
  })
  pendingByRegion.set(target, pending)
}

function isOpenModal(dialog: HTMLDialogElement | null | undefined): dialog is HTMLDialogElement {
  if (!dialog?.open)
    return false
  try {
    return dialog.matches(':modal')
  }
  catch {
    return false
  }
}

/**
 * 每次进入忙碌播报一次 `message`，挂载时已经忙碌也算一次。
 *
 * `element` 是控件里的任意元素，用来找它所在的模态对话框；不传时当场用公共播报区域念。
 * 路线在下一帧再选：同一轮里打开的对话框要等它自己的 `showModal()` 跑完。
 */
export function useBusyAnnouncement(
  busy: MaybeRefOrGetter<boolean>,
  message: MaybeRefOrGetter<string>,
  element?: MaybeRefOrGetter<Element | null | undefined>,
): void {
  const announce = useAnnounce()
  let frame: number | null = null

  function cancel(): void {
    if (frame != null && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
    frame = null
  }

  function speak(): void {
    const dialog = element == null ? null : toValue(element)?.closest('dialog')
    if (isOpenModal(dialog))
      announceInModal(dialog, toValue(message))
    else
      announce(toValue(message), 'polite')
  }

  watch(() => toValue(busy), (isBusy) => {
    cancel()
    if (!isBusy)
      return
    if (element == null || typeof requestAnimationFrame !== 'function') {
      speak()
      return
    }
    frame = requestAnimationFrame(() => {
      frame = null
      speak()
    })
  }, { immediate: true })

  onScopeDispose(cancel)
}

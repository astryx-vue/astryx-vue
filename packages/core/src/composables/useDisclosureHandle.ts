import type { Ref } from 'vue'
import { onBeforeUnmount, watchEffect } from 'vue'

export interface DisclosureHandle {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

/**
 * 模板里的 ref 会被自动解包，所以直接绑到模板上会拿到 null。
 * 请把读取函数交给 useDisclosureHandle，函数里再返回这个句柄。
 */
export type DisclosureHandleRef
  = | Ref<DisclosureHandle | null>
    | ((handle: DisclosureHandle | null) => void)

function publish(target: DisclosureHandleRef | undefined, value: DisclosureHandle | null): void {
  if (target == null)
    return
  if (typeof target === 'function')
    target(value)
  else
    target.value = value
}

/**
 * 把打开、关闭、切换和当前是否打开写到调用方持有的句柄上。
 * 必须传入读取函数。句柄本身常常就是一个 ref，直接交给 Vue 的解包会拿到里面的 null。
 * 句柄换掉时先把旧的清空，组件卸载时也清空。
 */
export function useDisclosureHandle(
  read: () => DisclosureHandleRef | undefined,
  handle: DisclosureHandle,
): void {
  let previous: DisclosureHandleRef | undefined
  watchEffect(() => {
    const target = read()
    if (previous != null && previous !== target)
      publish(previous, null)
    publish(target, handle)
    previous = target
  })

  onBeforeUnmount(() => publish(read(), null))
}

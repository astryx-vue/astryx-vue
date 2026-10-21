import type { Ref } from 'vue'
import { shallowRef } from 'vue'

/**
 * 打开的模态对话框清单。
 *
 * 原生模态对话框打开时，页面其它部分都变成不可交互，而且它盖在上面。
 * 像 toast 这种「全局常驻」的东西挂在 `body` 里就会被挡住、点不到，
 * 所以它得搬进最新的那个模态对话框里。这张清单就是「最新的模态框是谁」。
 *
 * 清单放在模块级：模态层是整页共用的，渲染在另一个 Vue 应用里的 toast
 * 也要能看见主应用打开的对话框。
 */
const outlets: HTMLDialogElement[] = []

/** 最新打开的那个模态对话框。没有就是 `null`。 */
const activeOutlet = shallowRef<HTMLDialogElement | null>(null)

function sync(): void {
  activeOutlet.value = outlets[outlets.length - 1] ?? null
}

/** 把一个已经打开的模态对话框登记成全局挂载点。 */
export function addModalOutlet(element: HTMLDialogElement): void {
  const index = outlets.indexOf(element)
  if (index !== -1)
    outlets.splice(index, 1)
  outlets.push(element)
  sync()
}

/** 取消登记。没登记过时什么也不做。 */
export function removeModalOutlet(element: HTMLDialogElement): void {
  const index = outlets.indexOf(element)
  if (index === -1)
    return
  outlets.splice(index, 1)
  sync()
}

/** 最新打开的模态对话框。没有时是 `null`，调用方退回挂到 `body`。 */
export function useActiveModalOutlet(): Readonly<Ref<HTMLDialogElement | null>> {
  return activeOutlet
}

/** 只给测试用：清空清单。 */
export function resetModalOutletsForTests(): void {
  outlets.length = 0
  sync()
}

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

/**
 * 一个模态层「打开期间充当全局挂载点」的登记手柄。
 * `attach` 登记并在它关闭（`close` 事件）时自动撤销，`detach` 手动撤销，重复调用无害。
 */
export function createModalOutletHandle(): { attach: (dialog: HTMLDialogElement) => void, detach: () => void } {
  let current: HTMLDialogElement | null = null

  function detach(): void {
    if (current == null)
      return
    current.removeEventListener('close', detach)
    removeModalOutlet(current)
    current = null
  }

  function attach(dialog: HTMLDialogElement): void {
    if (current === dialog)
      return
    detach()
    current = dialog
    dialog.addEventListener('close', detach)
    addModalOutlet(dialog)
  }

  return { attach, detach }
}

/**
 * 非模态的顶层元素（无遮罩的抽屉）每进入一次顶层就加一。
 *
 * 顶层里后进去的画在上面。toast 视口比抽屉先进顶层时会被它盖住，所以抽屉进去后
 * 报一声，视口重新进一次顶层，又排回最上面。模态层不用报：它们走上面的挂载点清单。
 */
const topLayerEntries = shallowRef(0)

/** 非模态的顶层元素刚进入顶层时调用。 */
export function notifyTopLayerEntry(): void {
  topLayerEntries.value++
}

/** 非模态顶层进入的计数。只用来监听变化。 */
export function useTopLayerEntries(): Readonly<Ref<number>> {
  return topLayerEntries
}

/** 只给测试用：清空清单。 */
export function resetModalOutletsForTests(): void {
  outlets.length = 0
  sync()
}

/**
 * 等模态对话框把进场动画跑完。
 *
 * 动画里的 `transform` 会让对话框成为子元素 `position: fixed` 的参照物，而顶层
 * （`popover`）元素只在已经被定位好之后才豁免。所以正在放动画的对话框里不能
 * 搬东西进去，等它稳定了再搬。
 *
 * 没有动画、不支持 Web Animations API 时立刻返回；兜底最长等 `timeout` 毫秒。
 */
export function whenModalSettled(element: HTMLElement, timeout = 600): Promise<void> {
  const animations = typeof element.getAnimations === 'function' ? element.getAnimations() : []
  const running = animations.filter(animation => animation.playState === 'running')
  if (running.length === 0)
    return Promise.resolve()

  const settled = Promise.all(running.map(animation => animation.finished.catch(() => undefined)))
    .then(() => undefined)
  const capped = new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
  return Promise.race([settled, capped])
}

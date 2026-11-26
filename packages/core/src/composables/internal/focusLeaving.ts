/**
 * @file focusLeaving.ts
 * @position 组件内部：一次状态变化会拿走或藏起带焦点的内容时，先记下焦点、变化提交后再挪走
 *
 * 配合 `focusReturn.ts` 的 `focusForLastInput`：挪动后的焦点环跟着上一次输入走。
 * 侧边导航收起轨道时，焦点所在的行会消失，用它把焦点交给收起按钮或最近的保留行。
 */
import { watch } from 'vue'
import { focusForLastInput, isFocusDetached } from './focusReturn.js'

/** 变化之前，焦点落在容器里的哪个元素。 */
export interface FocusWithin {
  readonly element: Element
  readonly container: HTMLElement
}

/**
 * 如果变化会让焦点丢掉就返回 true：现在哪儿都没有焦点，或者焦点还在即将被藏起的 `surface` 里。
 * 读 `surface` 自己所在的文档，所以 iframe 或画中画窗口里的元素也能判断。
 */
export function isFocusLost(surface: Element | null, doc?: Document): boolean {
  const ownerDocument = doc ?? surface?.ownerDocument ?? document
  return isFocusDetached(ownerDocument)
    || (surface != null && surface.contains(ownerDocument.activeElement))
}

/** 焦点元素在 `container` 里就返回它，否则返回 null。要在 DOM 变化之前调用。 */
export function noteFocusWithin(container: HTMLElement | null | undefined): FocusWithin | null {
  const active = container?.ownerDocument.activeElement
  if (container == null || active == null || !container.contains(active))
    return null
  return { element: active, container }
}

/**
 * 变化把焦点弄丢了（掉到页面上，或还留在被藏起的 `hidden` 里）才把焦点挪到 `target`；
 * 焦点没丢，或本来就不在里面，就不动。返回焦点有没有挪。
 */
export function moveFocusLeftBehind(
  note: FocusWithin | null,
  target: HTMLElement | null | undefined,
  hidden: Element | null = null,
): boolean {
  if (note == null || target == null || !isFocusLost(hidden, note.container.ownerDocument))
    return false
  focusForLastInput(target)
  return true
}

/**
 * `source` 变化时：DOM 更新之前调用 `note`（参数是离开的值），DOM 更新之后用它的结果调用 `move`。
 * `note` 返回 null 表示没有要挪的焦点。服务端渲染时侦听器不运行。
 */
export function useFocusLeavingChange<V, N>(
  source: () => V,
  note: (previous: V) => N | null,
  move: (noted: N, value: V) => void,
): void {
  let pending: N | null = null
  watch(source, (_value, previous) => {
    pending = note(previous)
  }, { flush: 'pre' })
  watch(source, (value) => {
    const noted = pending
    pending = null
    if (noted != null)
      move(noted, value)
  }, { flush: 'post' })
}

import { hasInteractiveAncestor } from '../useClickableContainer.js'

/**
 * 触屏按压模型里「这一下按的是谁」的判断：从手指落点往上找最里层的可按元素。
 *
 * 可按元素分两种：
 * - 普通可按元素（按钮、开关行……）：手指落在它里面任何地方，都是按它。
 * - 可按容器（列表行、TreeList 行、Token、可点卡片）：额外带 `data-astryx-press-container`。
 *   手指落在它里面的其他控件上（行尾的按钮、Token 的删除按钮、卡片里的输入框）时，
 *   这一下不会触发容器自己的动作，所以容器不亮。
 *   容器自己的动作元素（行里那个看不见的链接或按钮、Token 的主按钮）带 `data-astryx-press-action`，
 *   落在它上面就是按容器。
 */

/** 可按元素的标记。控制器用 `closest()` 找它。 */
export const PRESSABLE_ATTRIBUTE = 'data-astryx-pressable'

/** 可按容器的标记：里面别的控件被按下时，容器不亮。 */
export const PRESS_CONTAINER_ATTRIBUTE = 'data-astryx-press-container'

/** 可按容器自己的动作元素：按它就是按容器。 */
export const PRESS_ACTION_ATTRIBUTE = 'data-astryx-press-action'

/** 按钮组、提示对话框跟踪滑动的动作带这个标记，值是组跟踪的指针类型，比如 `touch pen`。 */
export const PRESS_GROUP_ITEM_ATTRIBUTE = 'data-astryx-press-group-item'

/** 这个元素（或它外面）是不是由组来画 `pointerType` 这种指针的按压。 */
export function isTrackedByGroup(element: Element, pointerType: string): boolean {
  const marked = element.closest(`[${PRESS_GROUP_ITEM_ATTRIBUTE}]`)
  return marked != null && (marked.getAttribute(PRESS_GROUP_ITEM_ATTRIBUTE) ?? '').split(' ').includes(pointerType)
}

/** 不可用的元素怎么按都不画。 */
const DISABLED = ':disabled, [aria-disabled="true"]'

/**
 * 手指按在容器里的另一个控件上：那个控件接走这次按压，容器的动作不会执行。
 * 落在容器自己的动作元素里不算。
 */
function landsOnNestedControl(target: Element, container: HTMLElement): boolean {
  const action = target.closest(`[${PRESS_ACTION_ATTRIBUTE}]`)
  if (action != null && container.contains(action))
    return false
  return hasInteractiveAncestor(target, container)
}

/**
 * 手指下最里层的可按元素。里层优先：可按的行里有个按钮，按钮接走这次按压。
 * 不可用的元素也会接走，但什么都不画，所以按在禁用控件上不会把外面那一行点亮。
 * 可按容器里落在别的控件上时，同样什么都不画。
 */
export function pressSurfaceAt(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element))
    return null
  const found = target.closest(`[${PRESSABLE_ATTRIBUTE}]`)
  if (!(found instanceof HTMLElement) || found.matches(DISABLED))
    return null
  if (found.hasAttribute(PRESS_CONTAINER_ATTRIBUTE) && target !== found && landsOnNestedControl(target, found))
    return null
  return found
}

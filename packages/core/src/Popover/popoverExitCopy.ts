/**
 * Popover 退场副本的私有标记：触屏关闭播在这份副本上。只有这个文件写标记名。
 */
import { placeLayerExitCopy } from '../layer/layerExitCopy.js'

const POPOVER_EXIT = 'data-astryx-popover-exit'

/** 给正在关闭的浮层放一份标成 Popover 的退场副本；返回 null 时关闭是立即的。 */
export function placePopoverExitCopy(element: HTMLElement): HTMLElement | null {
  return placeLayerExitCopy(element, POPOVER_EXIT)
}

/** `root` 下正在屏幕上的 Popover 退场副本。 */
export function findPopoverExitCopy(root: ParentNode): HTMLElement | null {
  return root.querySelector<HTMLElement>(`[${POPOVER_EXIT}]`)
}

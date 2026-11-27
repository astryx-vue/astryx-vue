/**
 * @file panelScroll.ts
 * @input 标签的面板 id、标签栏所在的文档，以及 core 内部触屏入口的滚动判断
 * @output scrollPanelToTop：把标签自己的滚动区带回顶部；panelScrollArea：找出那个滚动区
 * @position lab TabBar 内部：再次选中已选的标签时用
 */

import type { LogicalAxisMapping } from '@astryx-vue/core/internal/touch'
import { measureLogicalScrollAxis } from '@astryx-vue/core/internal/touch'

/** core 逻辑滚动判断里的竖直轴：横排时块方向就是竖直方向。 */
const VERTICAL: LogicalAxisMapping = {
  inline: 'x',
  block: 'y',
  inlineReversed: false,
  blockReversed: false,
}

/**
 * 标签自己的滚动区：面板本身能竖着滚就是它，否则是面板里第一个能竖着滚的元素。由 core 的
 * 判断来定，所以只多出一像素以内、或者只能横着滚的行不会被选中。
 */
export function panelScrollArea(panel: HTMLElement): HTMLElement | null {
  const walker = panel.ownerDocument.createTreeWalker(panel, NodeFilter.SHOW_ELEMENT)
  for (let node: Node | null = panel; node != null; node = walker.nextNode()) {
    const element = node as HTMLElement
    if (measureLogicalScrollAxis(element, 'block', VERTICAL)?.isScrollable === true)
      return element
  }
  return null
}

/**
 * 把 `panelId` 指向的面板的滚动区带回顶部，和 iOS 再次点已选标签时一样。别的滚动容器不动。
 * 平滑滚过去；开启「减少动态效果」时直接跳到顶部。
 */
export function scrollPanelToTop(document: Document, panelId: string | undefined): void {
  const panel = panelId == null ? null : document.getElementById(panelId)
  const area = panel == null ? null : panelScrollArea(panel)
  if (area == null || area.scrollTop === 0)
    return
  const isReduced = document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  area.scrollTo({ top: 0, behavior: isReduced ? 'instant' : 'smooth' })
}

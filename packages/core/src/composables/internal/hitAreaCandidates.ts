/**
 * @file hitAreaCandidates.ts
 * @input 页面结构的变化记录，和「这个元素该算给谁」的归属函数
 * @output 页面上可点元素的集合，随变化增量维护
 * @position 内部工具，`hitAreaWatch.ts` 用。
 *
 * 一层界面打开或关闭时，只对新增的子树做匹配、把离开的元素扫掉，不再对整页重新查询。
 * 被看着的控件按它自己的盒子算，所以集合里放的是「归属」：控件里面的可点部件并进控件。
 */
import { INTERACTIVE_SELECTOR } from './hitArea.js'

/** `root` 子树里（含它自己）的可点元素，各自换成它的归属。 */
export function interactiveWithin(root: ParentNode | Element, ownerOf: (element: Element) => Element): Element[] {
  const found = new Set<Element>()
  if (root instanceof Element && root.matches(INTERACTIVE_SELECTOR))
    found.add(ownerOf(root))
  for (const element of root.querySelectorAll(INTERACTIVE_SELECTOR))
    found.add(ownerOf(element))
  return [...found]
}

/** 离开文档的元素一次扫掉。 */
export function dropDisconnected(set: Set<Element>): void {
  for (const element of set) {
    if (!element.isConnected)
      set.delete(element)
  }
}

/**
 * 按一批变化更新集合：新增的子树单独匹配，离开的元素扫掉，
 * 改了 `href`、`role`、`tabindex` 这类属性的元素按新属性重新判断。
 */
export function applyMutations(set: Set<Element>, records: readonly MutationRecord[], ownerOf: (element: Element) => Element): void {
  for (const record of records) {
    if (record.type === 'childList') {
      for (const node of record.addedNodes) {
        if (node instanceof Element)
          interactiveWithin(node, ownerOf).forEach(element => set.add(element))
      }
      continue
    }
    const target = record.target
    if (!(target instanceof Element))
      continue
    const owner = ownerOf(target)
    if (target.matches(INTERACTIVE_SELECTOR))
      set.add(owner)
    else if (owner === target)
      set.delete(target)
  }
  dropDisconnected(set)
}

/**
 * 一个控件开始被看着：它里面的可点部件并成它自己，已经在集合里的子元素去掉。
 * 只处理它这棵子树，不碰页面上的其他元素。
 */
export function groupUnder(set: Set<Element>, element: Element): void {
  let found = element.matches(INTERACTIVE_SELECTOR)
  for (const candidate of set) {
    if (candidate !== element && element.contains(candidate)) {
      set.delete(candidate)
      found = true
    }
  }
  if (found || element.querySelector(INTERACTIVE_SELECTOR) != null)
    set.add(element)
}

/** 一个控件不再被看着：它的子树里的可点元素各自回到集合里。 */
export function ungroup(set: Set<Element>, element: Element, ownerOf: (element: Element) => Element): void {
  set.delete(element)
  interactiveWithin(element, ownerOf).forEach(candidate => set.add(candidate))
}

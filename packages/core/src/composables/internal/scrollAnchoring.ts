/**
 * @file scrollAnchoring.ts
 * @input 一个由组件自己掌管位置的滚动容器
 * @output setScrollAnchoringOff：在元素上关掉浏览器的滚动锚定，或还回去
 * @position 私有滚动锚定属性的唯一属主：属性名和规则只在这个文件里写。聊天的跟随滚动在贴着末尾时调用它
 */

const SCROLL_ANCHORING = 'data-astryx-scroll-anchoring'
/** 写在滚动容器上：这里的浏览器锚定已关。 */
const OFF = 'off'
/** 写在放这条规则的那一个 `<style>` 上。 */
const RULE = 'rule'

/**
 * 每个文档只加一次这条规则。规则挂在属性上而不是元素的行内样式，所以调用方自己的
 * `overflow-anchor` 既不会被读、也不会被写或还原，属性去掉后它重新生效。
 * `!important` 让行内的 `auto` 也没法在组件自己摆放内容的容器上把锚定重新打开。
 */
function ensureRule(doc: Document): void {
  if (doc.head.querySelector(`[${SCROLL_ANCHORING}="${RULE}"]`) != null)
    return
  const style = doc.createElement('style')
  style.setAttribute(SCROLL_ANCHORING, RULE)
  style.textContent = `[${SCROLL_ANCHORING}="${OFF}"]{overflow-anchor:none !important}`
  doc.head.appendChild(style)
}

/**
 * `isOff` 为真时关掉 `element` 上浏览器的滚动锚定，为假时还回去。
 * 组件独自移动容器位置期间调用，免得浏览器的原生锚定再移动一次。
 */
export function setScrollAnchoringOff(element: Element, isOff: boolean): void {
  if (isOff) {
    ensureRule(element.ownerDocument)
    element.setAttribute(SCROLL_ANCHORING, OFF)
  }
  else {
    element.removeAttribute(SCROLL_ANCHORING)
  }
}

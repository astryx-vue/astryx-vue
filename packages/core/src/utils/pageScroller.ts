/**
 * @file pageScroller.ts
 * @input 一个滚动容器元素
 * @output scrollsPage、scrollportTop、scrollEventTarget：容器本身就是整页滚动者时的几条规则
 * @position 页面滚动的判断只在这里写一遍，聊天的跟随滚动读它
 */

/**
 * 元素是不是整页的滚动者。页面滚动时根元素的盒子跟着一起移动，它的滚动事件触发在 document 上。
 * 即便滚动元素是 body（怪异模式），documentElement 也算：它的盒子照样随页面移动。
 */
export function scrollsPage(el: HTMLElement): boolean {
  const doc = el.ownerDocument
  return el === doc.scrollingElement || el === doc.documentElement
}

/** 容器可见区域的顶边（客户端坐标）。整页滚动者的顶边是视口顶部，它自己的盒子比视口顶部高出整段滚动量。 */
export function scrollportTop(el: HTMLElement): number {
  return scrollsPage(el) ? 0 : el.getBoundingClientRect().top
}

/** 容器的滚动事件触发在哪：整页滚动者触发在 document 上。 */
export function scrollEventTarget(el: HTMLElement): HTMLElement | Document {
  return scrollsPage(el) ? el.ownerDocument : el
}

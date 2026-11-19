const HIDDEN = '[aria-hidden="true"], [hidden]'
const BLOCKS = 'p, div, li, br, h1, h2, h3, h4, h5, h6'

/**
 * 对应原版 `hooks/useAnnounceRenderedText` 里的 `renderedText`：
 * 读屏会念到的文字。块级元素之间隔开，`aria-hidden` 和 `hidden` 的部分跳过。
 * 读的是真实 DOM，所以计算后的 display 也算数。
 */
export function renderedText(element: HTMLElement): string {
  const view = element.ownerDocument.defaultView
  const displayOf = (node: Element): string => view?.getComputedStyle(node).display ?? ''
  const parts: string[] = []
  const walk = (node: Node, parentDisplay: string): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.textContent ?? '')
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE)
      return
    const part = node as Element
    if (part.matches(HIDDEN))
      return
    const display = displayOf(part)
    const isBlock = part.matches(BLOCKS)
      || (display !== '' && display !== 'contents' && !display.startsWith('inline'))
      || /\b(?:flex|grid)\b/.test(parentDisplay)
    if (isBlock)
      parts.push(' ')
    part.childNodes.forEach(child => walk(child, display))
    if (isBlock)
      parts.push(' ')
  }
  const ownDisplay = displayOf(element)
  element.childNodes.forEach(child => walk(child, ownDisplay))
  return parts.join('').replace(/\s+/g, ' ').trim()
}

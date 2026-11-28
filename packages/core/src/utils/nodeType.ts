/**
 * 对应原版 Astryx 的 `utils/nodeType`。
 *
 * 按 `nodeType` 判断节点种类，不用 `instanceof`：别的窗口（iframe）里的节点也认得出来。
 */

/** `value` 是不是一个节点，不管来自哪个窗口。 */
export function isNode(value: unknown): value is Node {
  return (
    typeof value === 'object'
    && value != null
    && typeof (value as { nodeType?: unknown }).nodeType === 'number'
  )
}

/** `value` 是不是一个元素，不管来自哪个窗口。 */
export function isElement(value: unknown): value is Element {
  return isNode(value) && value.nodeType === 1
}

/** `value` 是不是一个 shadow root，不管来自哪个窗口。 */
export function isShadowRoot(value: unknown): value is ShadowRoot {
  return isNode(value) && value.nodeType === 11 && 'host' in value
}

/** `value` 是不是一个文档，不管来自哪个窗口。 */
export function isDocument(value: unknown): value is Document {
  return isNode(value) && value.nodeType === 9
}

/** `value` 是不是一个 HTML 元素，不管来自哪个窗口：看命名空间，在窗口之间搬过的元素也认得出来。 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  return isElement(value) && value.namespaceURI === 'http://www.w3.org/1999/xhtml'
}

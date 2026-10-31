import { domOverride, DOMRenderExtension } from '@lexical/html'
import { configExtension, TEXT_TYPE_TO_FORMAT, TextNode } from 'lexical'

const STRIKETHROUGH = TEXT_TYPE_TO_FORMAT.strikethrough
const BOLD_ITALIC = TEXT_TYPE_TO_FORMAT.bold | TEXT_TYPE_TO_FORMAT.italic

/**
 * 这个版本的文字节点外面要套哪几层元素，最外层在前。
 * 读的是这个版本自己的 `__format`：Lexical 的 getter 读的是最新版本，
 * 拿 `prevNode.hasFormat()` 得到的是新值，不是旧值。
 */
function wrappersOf(node: TextNode): ReadonlyArray<'del' | 'em'> {
  const format = node.__format
  const wrappers: Array<'del' | 'em'> = []
  if ((format & STRIKETHROUGH) !== 0)
    wrappers.push('del')
  // Lexical 把粗斜体只画成一个带斜体 class 的 `<strong>`，读屏软件听不到「强调」。
  if ((format & BOLD_ITALIC) === BOLD_ITALIC)
    wrappers.push('em')
  return wrappers
}

function sameWrappers(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  return a.length === b.length && a.every((tag, index) => tag === b[index])
}

/**
 * 删除线文字外面套 `<del>`，粗斜体外面套 `<em>`，和 core 的 Markdown 渲染出来的元素一致，
 * 读屏软件才能读出「删除」和「强调」。Lexical 自己建的文字元素原样放在里面，所以文档、
 * Markdown 和选区模型都不变；Lexical 找文字时从最外层往下走就能找到它。
 */
export const TextSemanticsExtension = configExtension(DOMRenderExtension, {
  overrides: [
    domOverride([TextNode], {
      $createDOM(node, $next) {
        let element = $next()
        for (const tag of [...wrappersOf(node)].reverse()) {
          const wrapper = document.createElement(tag)
          wrapper.append(element)
          element = wrapper
        }
        return element
      },
      $updateDOM(nextNode, prevNode, dom, $next, editor) {
        const wrappers = wrappersOf(nextNode)
        // 套的层数变了，就重建元素。
        if (!sameWrappers(wrappers, wrappersOf(prevNode)))
          return true
        if (wrappers.length === 0)
          return $next()
        // Lexical 只更新自己建的那层，它在这些外层元素里面。
        let element: Element | null = dom
        for (const tag of wrappers) {
          if (element?.tagName.toLowerCase() !== tag)
            return true
          element = element.firstElementChild
        }
        if (element === null)
          return true
        return nextNode.updateDOM(prevNode, element as HTMLElement, editor._config)
      },
    }),
  ],
})

import type { InjectionKey, Ref } from 'vue'
import { provide } from 'vue'

/**
 * 浮层的挂载点：浮层内容实际挂到哪个 DOM 元素里。
 *
 * 平时浮层挂到 `body`。但 Dialog 打开时它是一个原生模态层，页面上的东西都被
 * 它压住、也点不到，挂在 `body` 的浮层会看不见、点不着。所以 Dialog 打开时
 * 由它提供自己内部的挂载点，浮层优先挂进去。
 */

/** 最近的浮层挂载点。没提供时为 `null`，表示挂到 `body`。 */
export const layerMountKey: InjectionKey<Readonly<Ref<HTMLElement | null>>> = Symbol('astryx-layer-mount')

/** 由 Dialog 这类模态容器调用：打开期间浮层挂到 `el` 里。 */
export function provideLayerMountTarget(el: Readonly<Ref<HTMLElement | null>>): void {
  provide(layerMountKey, el)
}

/**
 * 不能把浮层挂进去的祖先元素。
 *
 * 两类原因：
 *
 * 1. HTML 解析规则。`<p>`、标题这类元素只收短语内容，里面塞块元素会让解析器
 *    提前闭合段落，浮层的内容就漏到页面上了。
 * 2. 交互祖先会抢走浮层自己的交互。浮层挂在 `<a>` 或 `<button>` 里，里面的链接
 *    和按钮都成了那个控件的子元素：点链接会跳转外层链接，浮层里每个可聚焦元素
 *    都并进那个控件自己的 Tab 位。
 *
 * 行内格式化元素也在名单里，因为它们会把排版（字号、居中等）传给浮层。
 */
const UNSAFE_HOSTS = new Set([
  // 只收短语内容的容器
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'dt',
  'pre',
  'legend',
  'data',
  'dfn',
  'meter',
  'output',
  'progress',
  'option',
  'optgroup',
  // 直接子元素受限制的结构容器
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'colgroup',
  'ul',
  'ol',
  'menu',
  'dl',
  'select',
  'datalist',
  'picture',
  'hgroup',
  'ruby',
  'rt',
  'rp',
  // 交互容器
  'a',
  'button',
  'label',
  'summary',
  // 行内格式化上下文
  'span',
  'em',
  'strong',
  'b',
  'i',
  'u',
  's',
  'small',
  'mark',
  'code',
  'kbd',
  'samp',
  'var',
  'sub',
  'sup',
  'abbr',
  'cite',
  'q',
  'time',
  'bdi',
  'bdo',
  'ins',
  'del',
])

/**
 * 算出浮层该挂到哪个元素上。
 *
 * 沿着浮层本来打算渲染的位置往上走：遇到不能挂的祖先就记下来，走到最近的原生
 * `<dialog>` 就停（再往外挂就出了模态层，浮层会变成不可交互）。返回 `null`
 * 表示原地渲染就行，不用搬家。
 *
 * 保留「尽量靠近原位」这一点是有意的：主题作用域和 Tab 顺序都挂在 DOM 位置上，
 * 直接挂到 `body` 会丢掉嵌套主题里的变量，也会让浮层里的可聚焦元素跑到页面末尾。
 */
export function resolveLayerMountTarget(inlineParent: HTMLElement | null): HTMLElement | null {
  if (inlineParent == null)
    return null

  let outermostUnsafe: HTMLElement | null = null
  let node: HTMLElement | null = inlineParent
  while (node != null) {
    const tagName = node.tagName.toLowerCase()
    if (tagName === 'dialog')
      break
    if (UNSAFE_HOSTS.has(tagName))
      outermostUnsafe = node
    node = node.parentElement
  }

  return outermostUnsafe?.parentElement ?? null
}

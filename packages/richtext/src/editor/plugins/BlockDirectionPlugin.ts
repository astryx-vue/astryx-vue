import type { ElementNode, Klass, LexicalEditor, LexicalNode } from 'lexical'
import { firstStrongDirection } from '@astryx-vue/core'
import { CodeNode } from '@lexical/code'
import { $isListItemNode, $isListNode, ListItemNode, ListNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { mergeRegister } from '@lexical/utils'
import {
  $getRoot,
  $isDecoratorNode,
  $isElementNode,
  $isRootNode,
  HISTORY_MERGE_TAG,
  ParagraphNode,
  TextNode,
} from 'lexical'
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { useLexicalEditor } from '../context.js'

/**
 * 当作一段正文读的容器：一个方向管到整块，不论嵌套多深（表格单元格里的段落也算）。
 *
 * Lexical 只给顶层块写 `dir="auto"`，更深的不写，两种状态都说不出「这一块自己没有方向」：
 * 在 `auto` 下，数字、图片、空块都和英文一样落到从左到右。把方向写出来，才分得开
 * 「文字自己定了方向」和「没有方向，跟着文档」；它还会随文档序列化，存下来的文档重新打开
 * 仍然按写下它时的样子读。
 *
 * 列表、围栏代码块、表格不在这里：它们装着好几项、好几行、好几格，各按各的读。
 */
const PROSE_NODES: ReadonlyArray<Klass<ElementNode>> = [ParagraphNode, HeadingNode, QuoteNode, ListItemNode]

/**
 * 容器。不管 `dir` 写了什么，样式都让它们取父级的方向，所以带 `dir` 进来不会改变画面；
 * 但粘贴的 HTML 和旧文档里可能带着，清掉它，存下来的状态才和看到的一致。
 *
 * 围栏代码块没有按行的节点能带方向，样式给它 `unicode-bidi: plaintext`，每行按自己的
 * 第一个强字符读。
 */
const CONTAINER_NODES: ReadonlyArray<Klass<ElementNode>> = [ListNode, CodeNode, TableNode, TableRowNode, TableCellNode]

function $isOwnDirectionBlock(node: LexicalNode): node is ElementNode {
  return $isElementNode(node) && PROSE_NODES.some(klass => node instanceof klass)
}

function $isContainer(node: LexicalNode): node is ElementNode {
  return $isElementNode(node) && CONTAINER_NODES.some(klass => node instanceof klass)
}

/**
 * 这个容器自己的文字要的方向，没有强方向字符时返回 null。
 *
 * 只有读者读到的文字才算。装饰节点（图片、图表、嵌入）自己不显示正文，`getTextContent`
 * 给的却是它的替代文字，英文说明会让一个希伯来文的列表项变成从左到右；围栏代码块各行
 * 自己读。core Markdown 读一块的方向时跳过同样的节点。
 *
 * Lexical 把嵌套列表放进接在父项后面的单独一项里。这一项不显示文字，也不是读者看到的块：
 * 它属于上面那一项，嵌套列表锚在父项的文字起点上，所以它取那一项的方向。
 */
function $ownDirection(node: ElementNode): 'ltr' | 'rtl' | null {
  if ($heldList(node) !== null) {
    const parentItem = $parentItemOf(node)
    return parentItem === null ? null : $ownDirection(parentItem)
  }
  return firstStrongDirection($proseText(node))
}

/** 这一项存在就是为了装的那个嵌套列表；它装的是正文时返回 null。 */
function $heldList(node: ElementNode): ElementNode | null {
  if (!$isListItemNode(node))
    return null
  const children = node.getChildren()
  const lists = children.filter($isListNode)
  return lists.length === 1 && children.length === lists.length ? lists[0]! : null
}

/** 装嵌套列表的这一项挂在哪一项下：它前面最近的一个正文项。 */
function $parentItemOf(node: ElementNode): ElementNode | null {
  let sibling = node.getPreviousSibling()
  while (sibling !== null) {
    if ($isListItemNode(sibling) && $heldList(sibling) === null)
      return sibling
    sibling = sibling.getPreviousSibling()
  }
  return null
}

/** 节点的正文后代的文字，装饰节点和代码块除外；读到第一个强字符就够了。 */
function $proseText(node: ElementNode): string {
  let text = ''
  for (const child of node.getChildren()) {
    if ($isDecoratorNode(child) || child instanceof CodeNode)
      continue
    text += $isElementNode(child) ? $proseText(child) : child.getTextContent()
    if (firstStrongDirection(text) !== null)
      break
  }
  return text
}

/** 这个节点该带的方向：文字定的，或者不带。 */
function $wantedDirection(node: LexicalNode): 'ltr' | 'rtl' | null {
  return $isOwnDirectionBlock(node) ? $ownDirection(node) : null
}

/** 这个节点的 `dir` 已经是它该是的样子。 */
function $isSettled(node: LexicalNode): boolean {
  if ($isRootNode(node))
    return node.getDirection() === null
  if (!$isOwnDirectionBlock(node) && !$isContainer(node))
    return true
  return (node as ElementNode).getDirection() === $wantedDirection(node)
}

function $writeOwnDirection(node: LexicalNode): void {
  if (!$isSettled(node))
    (node as ElementNode).setDirection($wantedDirection(node))
}

/**
 * 这个节点及它上面所有的正文容器，从近到远。
 *
 * 在列表深处敲一个字，改的是它所在的那一项，而装嵌套列表的那一项跟着它挂靠的项走，
 * 所以都要写。全部得在这次按键自己的 update 里写完：后面的扫描带着 `history-merge`，
 * 不会报给 `onChange`，留给它的话，调用方存下来的值要到下一次编辑才对。
 */
function $proseContainers(node: LexicalNode): ElementNode[] {
  const found: ElementNode[] = []
  for (let current: LexicalNode | null = node; current !== null; current = current.getParent()) {
    if ($isOwnDirectionBlock(current))
      found.push(current)
  }
  return found
}

/** 方向归这个插件管的所有节点，按文档顺序。 */
function $allProseContainers(): ElementNode[] {
  const found: ElementNode[] = []
  const visit = (node: LexicalNode): void => {
    if ($isOwnDirectionBlock(node) || $isContainer(node))
      found.push(node as ElementNode)
    if ($isElementNode(node))
      node.getChildren().forEach(visit)
  }
  // 根也是容器。Lexical 会把存下来的根方向写到可编辑元素上，下面所有容器都继承它，
  // 在一种文档方向下存的值换到另一种方向下就会整个排反。它自己没有文字，永远交出方向，由外层定。
  found.push($getRoot())
  $getRoot().getChildren().forEach(visit)
  return found
}

function $settleAll(): void {
  $allProseContainers().forEach($writeOwnDirection)
}

/** 让每个正文容器的 `dir` 等于它自己文字的方向。返回撤销函数。 */
export function registerBlockDirection(editor: LexicalEditor): () => void {
  return mergeRegister(
    // 在已有段落里打字，弄脏的是文字节点而不是容器，所以只能在文字节点上接住按键。
    // 在这里跑，方向就写进改动文字的那次 update，也就进了这次按键自己的撤销记录：
    // 之后再 `editor.update` 会成为单独的一步，撤销就会弹回去。
    editor.registerNodeTransform(TextNode, (node) => {
      $proseContainers(node).forEach($writeOwnDirection)
    }),
    // 容器得到或失去文字，而它自己的文字节点没被弄脏：新的空段落、标题转换、列表项拆分、删空一块。
    ...PROSE_NODES.map(klass => editor.registerNodeTransform(klass, (node) => {
      $proseContainers(node).forEach($writeOwnDirection)
    })),
    // 带着方向进来的容器（粘贴的 HTML、旧文档）交出方向。删掉一个节点会弄脏它的父级，
    // 所以删掉的列表项会走到这里；顺便把上面包着的那一项在同一次 update 里理好。
    ...CONTAINER_NODES.map(klass => editor.registerNodeTransform(klass, (node) => {
      $writeOwnDirection(node)
      $proseContainers(node).forEach($writeOwnDirection)
    })),
    // 整体换掉编辑器状态时不跑任何 transform，RichTextView 的 `value` 一变就是这样。
    // 发现有容器和它的文字对不上，就扫一遍文档。扫描并进引起它的那次 update，不另占一步撤销；
    // 写完容器就对上了，所以不会循环。
    editor.registerUpdateListener(({ editorState }) => {
      const stale = editorState.read(() => $allProseContainers().some(node => !$isSettled(node)))
      if (stale)
        editor.update($settleAll, { tag: HISTORY_MERGE_TAG })
    }),
  )
}

/**
 * 给每个正文容器（段落、标题、引用、列表项，不论嵌套多深）按自己文字写上显式的 `dir`：
 * 强方向的文字在任一种文档方向里都按自己的方向读，没有方向的跟着文档。
 */
export const BlockDirectionPlugin = defineComponent({
  name: 'AstryxRichTextBlockDirectionPlugin',
  setup() {
    const editor = useLexicalEditor()
    let teardown: (() => void) | undefined
    // 挂载时就登记并立刻理一遍：已经在编辑器里的文档没跑过任何 transform，
    // 要在浏览器画第一帧之前理好，不然一个英文段落会在从右到左的页面里先靠右一帧再挪走。
    onMounted(() => {
      teardown = registerBlockDirection(editor)
      editor.update($settleAll, { discrete: true, tag: HISTORY_MERGE_TAG })
    })
    onBeforeUnmount(() => teardown?.())
    return () => null
  },
})

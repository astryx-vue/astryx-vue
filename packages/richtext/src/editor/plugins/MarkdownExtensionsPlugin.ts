import type { MarkdownExtensionNode, MarkdownPluginEntry } from '@astryx-vue/core/Markdown/plugins'
import type { Transformer } from '@lexical/markdown'
import type { LexicalEditor, NodeKey, RangeSelection, TextFormatType } from 'lexical'
import type { PropType, VNodeChild } from 'vue'
import type { RichTextExtensionNode, RichTextExtensionNodeFacts } from '../../markdownExtensionNode.js'
import type { RichTextMarkdownExtension } from '../../markdownExtensions.js'
import { parseInlineAst, parseMarkdownAst } from '@astryx-vue/core/Markdown/parser'
import { MarkdownPluginNodeRenderer } from '@astryx-vue/core/Markdown/plugin-renderer'
import { $dfs, addClassNamesToElement, removeClassNamesFromElement } from '@lexical/utils'
import {
  $createNodeSelection,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  HISTORY_MERGE_TAG,
  TEXT_TYPE_TO_FORMAT,
} from 'lexical'
import { defineComponent, h, onBeforeUnmount, watchEffect } from 'vue'
import {
  $firstSelectedText,
  $isRichTextExtensionNode,
  RichTextExtensionNode as RichTextExtensionNodeClass,
  setRichTextExtensionNodeDecorator,
} from '../../markdownExtensionNode.js'
import { pluginsOf } from '../../markdownExtensions.js'
import { useLexicalEditor } from '../context.js'

/**
 * 从存下来的节点原文，用已采用的插件重新读一遍，得到 core 认的那个节点。
 * 没有同名同版本的插件、或者这段原文已经不被这个插件读成「同一个节点」时返回 null。
 */
export function deriveExtensionNode(
  facts: RichTextExtensionNodeFacts,
  plugins: ReadonlyArray<MarkdownPluginEntry>,
): MarkdownExtensionNode | null {
  const plugin = plugins.find(entry => entry.name === facts.plugin)
  if (plugin === undefined || plugin.apiVersion !== facts.apiVersion)
    return null
  const nodes: ReadonlyArray<{ readonly type: string }> = facts.display === 'inline'
    ? parseInlineAst(facts.source, { plugins: [plugin] })
    : parseMarkdownAst(facts.source, { plugins: [plugin] }).children
  const [node] = nodes
  if (nodes.length !== 1 || node?.type !== 'extension')
    return null
  const extension = node as MarkdownExtensionNode
  return extension.plugin === facts.plugin
    && extension.name === facts.name
    && extension.display === facts.display
    && extension.source === facts.source
    ? extension
    : null
}

/**
 * 插件节点可以放在哪些格式里面，最外层在前，和编辑器画文字的方式一致（`textSemantics.ts`）：
 * 先删除线，再斜体，再粗体。
 */
const MARKS: ReadonlyArray<readonly [TextFormatType, 'del' | 'em' | 'strong']> = [
  ['strikethrough', 'del'],
  ['italic', 'em'],
  ['bold', 'strong'],
]

/** 切换这些格式时，插件节点会跟着走。 */
const NODE_FORMATS: ReadonlySet<TextFormatType> = new Set(MARKS.map(([format]) => format))

/** 把插件节点的内容画出来；放在粗体、斜体、删除线里面的节点，画在同样的元素里面。 */
const ExtensionNodeView = defineComponent({
  name: 'AstryxRichTextExtensionNodeView',
  props: {
    facts: { type: Object as PropType<RichTextExtensionNodeFacts>, required: true },
    format: { type: Number, required: true },
    plugins: { type: Array as PropType<ReadonlyArray<MarkdownPluginEntry>>, required: true },
  },
  setup(props) {
    return (): VNodeChild => {
      const node = deriveExtensionNode(props.facts, props.plugins)
      let content: VNodeChild = node === null
        ? props.facts.source
        : h(MarkdownPluginNodeRenderer, { plugins: props.plugins as MarkdownPluginEntry[], node })
      for (const [type, tag] of [...MARKS].reverse()) {
        if ((props.format & TEXT_TYPE_TO_FORMAT[type]) !== 0)
          content = h(tag, [content])
      }
      return content
    }
  },
})

/**
 * 给所有插件节点重新画一遍：标一下脏，Lexical 就会用编辑器现在的画法再画。
 * 这不是编辑，所以不进撤销历史。
 */
function redrawExtensionNodes(editor: LexicalEditor): void {
  editor.update(() => {
    for (const { node } of $dfs()) {
      if ($isRichTextExtensionNode(node))
        node.markDirty()
    }
  }, { tag: HISTORY_MERGE_TAG })
}

/** 工具栏切换格式后，这个范围选区里「正好会开着」的状态；范围里没有文字、只有节点时返回 null。 */
function $nextTextFormat(selection: RangeSelection, format: TextFormatType): boolean | null {
  const first = $firstSelectedText(selection)
  return first === null ? null : (first.getFormatFlags(format, null) & TEXT_TYPE_TO_FORMAT[format]) !== 0
}

/** 选中的插件节点要显示焦点环：按 Lexical 的选区状态加减主题里的类名。 */
function syncSelectedRing(editor: LexicalEditor): () => void {
  const selectedKeys = new Set<NodeKey>()
  return editor.registerUpdateListener(({ editorState }) => {
    const className: unknown = editor._config.theme.markdownExtensionSelected
    if (typeof className !== 'string' || className === '')
      return
    const now = new Set<NodeKey>()
    editorState.read(() => {
      for (const { node } of $dfs()) {
        if ($isRichTextExtensionNode(node) && node.isSelected())
          now.add(node.getKey())
      }
    })
    for (const key of now) {
      const element = editor.getElementByKey(key)
      if (element !== null)
        addClassNamesToElement(element, className)
    }
    for (const key of selectedKeys) {
      if (!now.has(key)) {
        const element = editor.getElementByKey(key)
        if (element !== null)
          removeClassNamesFromElement(element, className)
      }
    }
    selectedKeys.clear()
    for (const key of now)
      selectedKeys.add(key)
  })
}

export interface MarkdownExtensionsOptions {
  extensions: ReadonlyArray<RichTextMarkdownExtension>
  /** 这个界面的 Markdown 转换器，要和这些扩展对一下有没有冲突。 */
  transformers: ReadonlyArray<Transformer>
}

/**
 * 让编辑器用已采用的插件画 Markdown 插件节点，返回取消注册的函数。
 * 先检查配置（冲突就抛 `RichTextExtensionError`）；每个节点都用采用的插件从原文重新读一遍、
 * 交给 core 的 `MarkdownPluginNodeRenderer` 画，所以画法、兜底、出错都和 Markdown 里一样；
 * 存下来的数据不会单独拿来画；插件不认了、或者插件没采用的节点，显示它的原文。
 */
export function registerMarkdownExtensions(editor: LexicalEditor, options: MarkdownExtensionsOptions): () => void {
  const plugins = pluginsOf(options.extensions, options.transformers)
  const unset = setRichTextExtensionNodeDecorator(editor, (facts, format, nodeKey) =>
    h(ExtensionNodeView, { key: nodeKey, facts, format, plugins }))
  redrawExtensionNodes(editor)

  // 点一下节点就选中整个节点，和点分割线一样，指针用户也能给它加格式或删掉它。
  const stopClick = editor.registerCommand(CLICK_COMMAND, (event) => {
    if (!editor.isEditable() || !(event.target instanceof Node))
      return false
    for (const [key, node] of editor.getEditorState()._nodeMap) {
      if (!$isRichTextExtensionNodeShallow(node))
        continue
      const element = editor.getElementByKey(key)
      if (element !== null && element.contains(event.target)) {
        editor.update(() => {
          const selection = $createNodeSelection()
          selection.add(key)
          $setSelection(selection)
        })
        return true
      }
    }
    return false
  }, COMMAND_PRIORITY_LOW)

  // 粗体、斜体、删除线作用在一段选区上时，选区里的插件节点跟着走，仍然在周围文字的格式里面；
  // 选区里只有节点时，格式单独作用在它们身上。
  const stopFormat = editor.registerCommand(FORMAT_TEXT_COMMAND, (format) => {
    const selection = $getSelection()
    if (!NODE_FORMATS.has(format) || selection === null)
      return false
    const nodes = selection.getNodes().filter((node): node is RichTextExtensionNode => $isRichTextExtensionNode(node) && node.isInline())
    if (nodes.length === 0)
      return false
    // 先读 Lexical 会给选中文字的状态，再让它去做；没选文字、只有节点时是 null。
    const textState = $isRangeSelection(selection) ? $nextTextFormat(selection, format) : null
    if ($isRangeSelection(selection))
      selection.formatText(format)
    const isOn = textState ?? !nodes.every(node => node.hasFormat(format))
    for (const node of nodes)
      node.setFormatFlag(format, isOn)
    return true
  }, COMMAND_PRIORITY_LOW)

  const stopRing = syncSelectedRing(editor)
  return () => {
    stopRing()
    stopFormat()
    stopClick()
    unset()
    redrawExtensionNodes(editor)
  }
}

/** 点击检测要遍历节点表，这里不在 Lexical 的读上下文里，所以只看节点对象的类，不调用 `$` 函数。 */
function $isRichTextExtensionNodeShallow(node: unknown): node is RichTextExtensionNode {
  return node instanceof RichTextExtensionNodeClass
}

/**
 * 没有界面的组件：用 `markdownExtensions` 采用的插件画 Markdown 插件节点。
 * `<RichTextEditor>` 和 `<RichTextView>` 在传了 `markdownExtensions` 时自己会用它。
 */
export const MarkdownExtensionsPlugin = defineComponent({
  name: 'AstryxRichTextMarkdownExtensionsPlugin',
  props: {
    extensions: { type: Array as PropType<ReadonlyArray<RichTextMarkdownExtension>>, required: true },
    transformers: { type: Array as PropType<ReadonlyArray<Transformer>>, required: true },
  },
  setup(props) {
    const editor = useLexicalEditor()
    let stop: (() => void) | undefined
    watchEffect(() => {
      stop?.()
      stop = registerMarkdownExtensions(editor, { extensions: props.extensions, transformers: props.transformers })
    })
    onBeforeUnmount(() => stop?.())
    return () => null
  },
})

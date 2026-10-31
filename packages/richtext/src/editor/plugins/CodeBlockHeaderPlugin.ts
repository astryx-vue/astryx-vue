import type { VNodeChild } from 'vue'
import { Icon, IconButton, useAstryxMessages, useCopyToClipboard } from '@astryx-vue/core'
import { $isCodeNode } from '@lexical/code'
import { $getNodeByKey, $getRoot } from 'lexical'
import { defineComponent, h } from 'vue'
import { useLexicalEditor } from '../context.js'
import { useOverlayPlacements } from './useOverlayPlacements.js'

/** 一个代码块的标题栏要画在哪里：相对编辑区容器的像素坐标。 */
interface HeaderPlacement {
  key: string
  language: string | null
  top: number
  left: number
  width: number
}

const PLAIN_TEXT = 'plaintext'

/**
 * 标题栏上写不写语言，和 core 的 CodeBlock 一致：围栏没写语言就不写，
 * 恰好是 `plaintext` 也不写（core 的 Markdown 会给没有信息串的围栏补上它）。
 */
export function displayLanguageOf(language: string | null | undefined): string | null {
  return language == null || language === '' || language === PLAIN_TEXT ? null : language
}

function samePlacements(a: readonly HeaderPlacement[], b: readonly HeaderPlacement[]): boolean {
  return a.length === b.length && a.every((p, i) => {
    const q = b[i]!
    return p.key === q.key && p.language === q.language && p.top === q.top && p.left === q.left && p.width === q.width
  })
}

/** 绝对定位用的内联样式：位置是量出来的屏幕坐标，已经把方向算进去了。 */
function positionStyle(p: HeaderPlacement): Record<string, string> {
  return { position: 'absolute', top: `${p.top}px`, left: `${p.left}px`, width: `${p.width}px` }
}

const CodeBlockHeader = defineComponent({
  name: 'AstryxRichTextCodeBlockHeader',
  props: { placement: { type: Object as () => HeaderPlacement, required: true } },
  setup(props) {
    const editor = useLexicalEditor()
    const messages = useAstryxMessages()
    const { copy, isCopied } = useCopyToClipboard({ announce: messages.value.codeBlock.copied })

    function copyCode(): void {
      const code = editor.getEditorState().read(() => $getNodeByKey(props.placement.key)?.getTextContent() ?? '')
      void copy(code)
    }

    return (): VNodeChild => {
      const { placement } = props
      const label = isCopied.value ? messages.value.codeBlock.copied : messages.value.codeBlock.copyCode
      const button = h(IconButton, {
        label,
        variant: 'ghost',
        size: 'sm',
        tooltip: messages.value.codeBlock.copyCode,
        class: 'astryx-richtext-code-header__copy',
        onClick: copyCode,
      }, { default: () => h(Icon, { icon: isCopied.value ? 'check' : 'copy', size: 'sm', color: 'inherit' }) })

      // 没写语言：只在右上角放一个复制按钮；写了语言：左边是语言名，右边是复制按钮。
      if (placement.language === null) {
        return h('div', { 'class': 'astryx-richtext-code-header astryx-richtext-code-header--corner', 'data-richtext-code-header': '', 'style': positionStyle(placement) }, [button])
      }
      return h('div', { 'class': 'astryx-richtext-code-header', 'data-richtext-code-header': '', 'style': positionStyle(placement) }, [
        h('span', { class: 'astryx-richtext-code-header__title' }, placement.language),
        button,
      ])
    }
  },
})

/**
 * 在每个顶层代码块上面画一条标题栏（语言名加复制按钮），跟着文档、编辑区尺寸、窗口变化。
 * 没有界面输入，放进 `<RichTextEditor>` 的默认插槽即可；编辑器默认已经带上了它。
 */
export const CodeBlockHeaderPlugin = defineComponent({
  name: 'AstryxRichTextCodeBlockHeaderPlugin',
  setup() {
    const editor = useLexicalEditor()
    const placements = useOverlayPlacements<HeaderPlacement>(editor, (origin) => {
      return $getRoot().getChildren().filter($isCodeNode).flatMap((node): HeaderPlacement[] => {
        const element = editor.getElementByKey(node.getKey())
        if (element === null)
          return []
        const box = element.getBoundingClientRect()
        // 画在代码块边框里面，和主题给标题栏留的内边距对齐。
        return [{
          key: node.getKey(),
          language: displayLanguageOf(node.getLanguage()),
          top: box.top - origin.top + element.clientTop,
          left: box.left - origin.left + element.clientLeft,
          width: element.clientWidth,
        }]
      })
    }, samePlacements)
    return () => placements.value.map(p => h(CodeBlockHeader, { key: p.key, placement: p }))
  },
})

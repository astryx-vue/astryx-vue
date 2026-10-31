import type { LinkMatcher } from '@lexical/link'
import type { PropType } from 'vue'
import { defineComponent, onBeforeUnmount, watchEffect } from 'vue'
import { useLexicalEditor } from '../context.js'
import { registerRichTextAutoLink } from './autoLink.js'

/**
 * 没有界面的组件：放在 `<RichTextEditor>` 的默认插槽里，输入或粘贴的网址、邮箱就会自动变成链接。
 *
 * ```vue
 * <RichTextEditor label="Notes">
 *   <RichTextEditorAutoLinkPlugin />
 * </RichTextEditor>
 * ```
 */
export const RichTextEditorAutoLinkPlugin = defineComponent({
  name: 'AstryxRichTextEditorAutoLinkPlugin',
  props: {
    /** 要识别哪些写法，默认网址和邮箱。用 `createLinkMatcherWithRegExp` 可以加自己的，比如工单号。 */
    matchers: { type: Array as PropType<LinkMatcher[]>, default: undefined },
  },
  emits: {
    /** 自动加、改、去掉链接时触发：新网址（去掉时是 `null`）和原来的网址。 */
    change: (_url: string | null, _prevUrl: string | null) => true,
  },
  setup(props, { emit }) {
    const editor = useLexicalEditor()
    let stop: (() => void) | undefined
    watchEffect(() => {
      stop?.()
      stop = registerRichTextAutoLink(editor, {
        matchers: props.matchers,
        onChange: (url, prevUrl) => emit('change', url, prevUrl),
      })
    })
    onBeforeUnmount(() => stop?.())
    return () => null
  },
})

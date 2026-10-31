import type { LexicalEditor, NodeKey } from 'lexical'
import type { PropType, VNodeChild } from 'vue'
import { defineComponent, h, onBeforeUnmount, shallowRef, Teleport } from 'vue'

/**
 * Lexical 的装饰节点（DecoratorNode）在文档里只占一个位置，里面画什么交给界面框架。
 * 这个组件监听编辑器的装饰节点变化，把每个节点的 `decorate()` 返回值用 `Teleport`
 * 画进 Lexical 给它建好的那个元素里。Vue 的组件树、响应式和 `provide`/`inject` 因此
 * 都能在节点内容里照常使用。
 *
 * `decorate()` 返回 Vue 的 `VNodeChild`（组件、字符串、vnode）；返回 `null` 的节点不画。
 */
export const DecoratorTeleports = defineComponent({
  name: 'AstryxRichTextDecoratorTeleports',
  props: {
    editor: { type: Object as PropType<LexicalEditor>, required: true },
  },
  setup(props) {
    const decorators = shallowRef<Record<NodeKey, VNodeChild>>({ ...props.editor.getDecorators<VNodeChild>() })
    // Lexical 每次更新后会把整张 { 节点键: 内容 } 表交过来；换一份新对象才能触发重画。
    const stop = props.editor.registerDecoratorListener<VNodeChild>((next) => {
      decorators.value = { ...next }
    })
    onBeforeUnmount(stop)

    return () => Object.entries(decorators.value).flatMap(([key, content]) => {
      const element = props.editor.getElementByKey(key)
      if (element === null || content == null)
        return []
      return [h(Teleport, { to: element, key }, [content])]
    })
  },
})

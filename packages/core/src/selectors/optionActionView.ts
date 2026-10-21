import type { Component, PropType } from 'vue'
import type { OptionActionNode } from './optionAction.js'
import { cloneVNode, defineComponent, h, isVNode } from 'vue'

/** 把调用方的操作画出来，不另包一层标签。缺 id 时补上，读屏才能指到它。 */
export const OptionAction = defineComponent({
  name: 'AstryxOptionAction',
  props: {
    node: { type: Object as PropType<OptionActionNode>, required: true },
    domId: { type: String, required: true },
  },
  setup(props) {
    return () => {
      const node = props.node
      if (!isVNode(node))
        return h(node as Component, { id: props.domId })
      if (typeof node.props?.id === 'string' && node.props.id !== '')
        return node
      return cloneVNode(node, { id: props.domId })
    }
  },
})

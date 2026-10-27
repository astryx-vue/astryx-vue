import type { PropType, VNodeChild } from 'vue'
import type { MarkdownExtensionNode, MarkdownPluginEntry } from '../plugin-protocol/protocol.js'
import { defineComponent } from 'vue'
import { collectProtocolRenderers } from '../plugin-protocol/protocol.js'

export interface MarkdownPluginNodeRendererProps {
  node: MarkdownExtensionNode
  plugins: readonly MarkdownPluginEntry[]
}

function plain(node: MarkdownExtensionNode): string {
  return node.source ?? ''
}

/**
 * Draw one extension node with the renderer its plugin declared.
 * A thrown renderer falls back to the node's source text.
 */
export const MarkdownPluginNodeRenderer = defineComponent({
  name: 'MarkdownPluginNodeRenderer',
  props: {
    node: { type: Object as PropType<MarkdownExtensionNode>, required: true },
    plugins: { type: Array as PropType<MarkdownPluginEntry[]>, required: true },
  },
  setup(props) {
    return (): VNodeChild => {
      const node = props.node
      const renderer = collectProtocolRenderers(props.plugins).get(`${node.plugin}\0${node.name}`)
      if (renderer == null)
        return plain(node)
      try {
        const rendered = renderer.render({ node })
        if (typeof rendered === 'string' || typeof rendered === 'number')
          return rendered
        if (rendered != null && typeof rendered === 'object')
          return rendered as VNodeChild
      }
      catch {
        // Fall back to the plugin's own plain text.
      }
      try {
        return renderer.toText(node)
      }
      catch {
        return plain(node)
      }
    }
  },
})

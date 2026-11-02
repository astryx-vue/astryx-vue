/**
 * @file RenderVNode.ts
 * @input A VNodeChild produced by the caller's renderLineAnnotation function
 * @output A component that renders that node as its whole output
 * @position Lab helper; lets DiffViewer store annotation VNodes in its row model
 */

import type { VNodeChild } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AstryxDiffViewerRenderVNode',
  props: {
    content: { required: true },
  },
  setup(props) {
    return () => props.content as VNodeChild
  },
})

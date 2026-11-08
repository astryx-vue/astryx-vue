import type { PropType, VNodeChild } from 'vue'
import { defineComponent } from 'vue'

/** 在 SVG 外渲染交互组件登记的 HTML 覆盖层。 */
export default defineComponent({
  name: 'AstryxChartOverlayHost',
  props: {
    renderer: {
      type: Function as PropType<() => VNodeChild>,
      required: true,
    },
  },
  setup(props) {
    return () => props.renderer()
  },
})

import { defineComponent } from 'vue'

/** 把插件交回来的 VNode 画出来。 */
export const VNodeHost = defineComponent({
  name: 'AstryxVNodeHost',
  props: {
    nodes: { type: null, default: null },
  },
  setup(props) {
    return () => props.nodes ?? null
  },
})

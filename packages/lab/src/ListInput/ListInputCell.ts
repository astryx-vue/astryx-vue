import type { VNodeChild } from 'vue'
import { defineComponent } from 'vue'

/**
 * 把调用方给的 `renderInput` 函数当组件渲染。
 *
 * 渲染函数必须在渲染阶段调用，所以这里包一层：单元格的壳子留在模板里，
 * 壳子里只剩这一层转发。
 */
export default defineComponent({
  name: 'AstryxListInputCell',
  props: {
    render: { type: Function, required: true },
    context: { type: Object, required: true },
  },
  setup(props) {
    return (): VNodeChild => (props.render as (context: unknown) => VNodeChild)(props.context)
  },
})

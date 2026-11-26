import { defineComponent } from 'vue'

/** 没有标签、说明和状态时代替 Field 的外壳：只渲染默认插槽，不加任何元素。 */
export default defineComponent({
  name: 'DateInputPassThrough',
  setup(_, { slots }) {
    return () => slots.default?.({})
  },
})

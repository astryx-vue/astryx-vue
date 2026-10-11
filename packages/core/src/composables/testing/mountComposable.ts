import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

/** 在真正的组件 setup 里调用组合式函数，这样挂载和卸载钩子会跑。 */
export function mountComposable<T>(setup: () => T): { result: T, wrapper: VueWrapper } {
  let result!: T
  const wrapper = mount(defineComponent({
    name: 'ComposableHost',
    setup() {
      result = setup()
      return () => h('div')
    },
  }))
  return { result, wrapper }
}

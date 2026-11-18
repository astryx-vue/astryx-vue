import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, defineComponent, provide, toValue } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

/**
 * @file SizeContext.ts
 * @input 浮层作用域 context 登记、provide/inject
 * @output SizeContext、useSize、provideSize、SizeProvider、ElementSize
 * @position Context provider；被 Button、TextInput、TabList、Selector 等消费
 *
 * 通用的尺寸 context：让容器组件（Toolbar、InputGroup、ButtonGroup 等）把默认尺寸
 * 往下传给交互子组件。子组件只把它当回退值，显式写了 `size` 一律优先。
 *
 * 和原版一样属于浮层作用域：Teleport 出去的浮层内容不会继承外面的尺寸。
 */

/** 交互组件通用的三档尺寸。 */
export type ElementSize = 'sm' | 'md' | 'lg'

/**
 * 容器往下传默认尺寸的 context。值是一个 getter/ref 的解包形式；
 * `null` 表示外面没有容器提供尺寸，组件走自己的默认值。
 */
export const SizeContext = defineLayerScopedKey<Readonly<Ref<ElementSize | null>> | null>('SizeContext', null)

/**
 * 解析最终尺寸：显式 prop > 外层 context > 默认值。
 * 返回计算属性，prop 和 context 变化都会跟上。
 */
export function useSize<T extends string = ElementSize>(
  sizeProp: MaybeRefOrGetter<T | undefined>,
  defaultSize: T = 'md' as T,
): ComputedRef<T> {
  const inherited = readLayerScoped(SizeContext)
  return computed(() => toValue(sizeProp) ?? (inherited?.value as T | null | undefined) ?? defaultSize)
}

/** 在 setup 里往下提供尺寸（组件内部用，等价于原版的 `<SizeProvider value>`）。 */
export function provideSize(size: MaybeRefOrGetter<ElementSize | null>): void {
  provide(SizeContext, computed(() => toValue(size)))
}

/**
 * 声明式提供者，对应原版的 `<SizeProvider value="sm">`。
 * 渲染时不产生额外 DOM，只把默认槽原样透传。
 */
export const SizeProvider = defineComponent({
  name: 'AstryxSizeProvider',
  props: {
    value: { type: String as () => ElementSize | null, default: null },
  },
  setup(props, { slots }) {
    provideSize(() => props.value)
    return () => slots.default?.()
  },
})

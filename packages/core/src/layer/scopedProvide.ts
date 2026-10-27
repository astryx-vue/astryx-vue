import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'
import '../../styles/layer.css'

/**
 * @file scopedProvide.ts
 * @input 各组件 context 模块在定义 key 时的登记
 * @output 登记表、读取同一个默认值的读者，以及浮层内容根上的重置
 * @position Layer runtime; spec:AST-038 (surface membership)
 *
 * 「成员关系」类 context 说的是「我属于外面那个组」：按钮组给我尺寸和禁用
 * 状态、单选组给我选中值、菜单给我关闭入口。这些信息只在组的 DOM 范围里成立。
 *
 * 浮层被 Teleport 出去以后，DOM 上已经不在组里面了（`closest('.astryx-button-group')`
 * 是空的），但 Vue 的 provide/inject 跟的是组件树，不看 DOM，Teleport 也切不断。
 * 结果就是：禁用的按钮组里打开一个 Popover，Popover 里的按钮也是禁用的，点不动。
 * 上游用 `LayerContentBoundary` 把这些 context 整值重置回默认值来解决。
 *
 * 做法：定义 key 的模块调用 `defineLayerScopedKey`，把 key 和默认值放进登记表。
 * 每个浮层的内容根在 setup 里调 `resetLayerScopedContext()`，把这些 key 重新
 * provide 成同一个默认值。要赶在这层组件自己的 provide 前面调用，后面自己提供的
 * 值会照常覆盖默认值。读者用 `readLayerScoped`，这样「没有组」和「被浮层截断」
 * 拿到的是同一个默认值。
 */

interface LayerScopedRegistration {
  key: InjectionKey<unknown>
  /** 进了浮层以后重新提供的值，和 `readLayerScoped` 的默认值是同一个。 */
  resetValue: unknown
}

const registrations: LayerScopedRegistration[] = []
const defaults = new Map<InjectionKey<unknown>, unknown>()

/**
 * 定义一个「进了浮层就重置」的 context key。
 * 默认值同时是读者在没有任何提供者时拿到的值。
 */
export function defineLayerScopedKey<T>(name: string, defaultValue: T): InjectionKey<T> {
  const key = Symbol(name) as InjectionKey<T>
  const stored = key as InjectionKey<unknown>
  registrations.push({ key: stored, resetValue: defaultValue })
  defaults.set(stored, defaultValue)
  return key
}

/** 读取登记过的 context。必须在 setup 里调用。 */
export function readLayerScoped<T>(key: InjectionKey<T>): T {
  const fallback = defaults.get(key as InjectionKey<unknown>) as T
  return inject(key, fallback)
}

/** 把登记表里的 key 在当前组件里重新提供成默认值。可以重复调用。 */
export function resetLayerScopedContext(): void {
  for (const { key, resetValue } of registrations)
    provide(key, resetValue)
}

/** 登记表里的 key，按登记顺序。 */
export function registeredLayerScopedContexts(): readonly InjectionKey<unknown>[] {
  return registrations.map(entry => entry.key)
}

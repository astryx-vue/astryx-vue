import type { FunctionalComponent, VNodeChild } from 'vue'

/**
 * 渲染一个插槽函数的输出。栈从 NavigationScreen 上读出内容和栏尾部内容的插槽函数，
 * 交给卡片和栏各自渲染；组件类型不变，内容按普通的差异更新，不会被整块重建。
 */
export const SlotOutlet: FunctionalComponent<{ render?: () => VNodeChild }> = props => props.render?.() ?? null
SlotOutlet.props = ['render']
SlotOutlet.displayName = 'AstryxNavigationSlotOutlet'

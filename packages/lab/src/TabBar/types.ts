import type { ExtendedIconName } from '@astryx-vue/core'
import type { Component, VNodeChild } from 'vue'

/** 标签的图标：语义图标名（如 `home`）、CSS 图标类、组件，或渲染函数。 */
export type TabBarIcon = ExtendedIconName | Component | (() => VNodeChild)

export interface TabBarItemProps {
  /** 在 `modelValue`、`change` 和 `reselect` 里代表这个标签。 */
  value: string
  /** 标签名，显示在图标下面。 */
  label: string
  /** 标签的图标，用当前文字颜色绘制。 */
  icon?: TabBarIcon
  /** 选中时的图标（实心版）。默认是 `icon`。 */
  selectedIcon?: TabBarIcon
  /** 图标右上角的角标：数字或短字符串。不传或传空字符串就没有角标。 */
  badge?: string | number
  /** 读屏在标签名后念的角标内容（如「3 条未读」）。默认念角标本身。 */
  badgeLabel?: string
  /**
   * 这个标签控制的面板 id，写成 `aria-controls`；面板元素上放同一个 id。再次选中已选的
   * 标签时，面板滚回顶部：面板自己能滚就滚它，否则滚面板里第一个滚动区。
   */
  panelId?: string
  /**
   * 禁用这个标签，和 core 的 Tab 一样：仍能聚焦、变暗，但永远不会被选中。点、按键、
   * 在它上面松手都不选它，方向键跳过它。
   */
  disabled?: boolean
}

export interface TabBarProps {
  /** 选中标签的 `value`。配合 `v-model` 使用。 */
  modelValue: string
  /** 标签栏的无障碍名称。不给它和 `ariaLabel`、`ariaLabelledby` 时，按读屏语言叫「标签页」。 */
  label?: string
  /** 和 `label` 一样给标签列表命名，优先于 `label`。 */
  ariaLabel?: string
  /** 用另一个元素给标签列表命名，优先于前两者。 */
  ariaLabelledby?: string
  /**
   * 标签超过五个时「更多」标签的值。栏里显示前四个和「更多」；`modelValue` 是它、或者是第四个
   * 之后的任何一个标签时，「更多」显示为选中（UIKit 的 `moreNavigationController`）。
   * @default 'more'
   */
  moreValue?: string
}

export interface TabBarEmits {
  /** 选了另一个标签，带着它的 `value`。 */
  (event: 'update:modelValue', value: string): void
  /** 和 `update:modelValue` 同时触发。 */
  (event: 'change', value: string): void
  /**
   * 再次选中已选的标签，带着它的 `value`：像 iOS 那样把它的导航栈退回根。它的面板
   * （`panelId`）也滚回顶部。
   */
  (event: 'reselect', value: string): void
}

export interface TabBarSlots {
  /** 标签：按顺序放 `TabBarItem`。 */
  default?: () => VNodeChild
}

export interface TabBarMoreListProps {
  /** 选中标签的值：它那一行显示为选中。 */
  modelValue?: string
}

export interface TabBarMoreListEmits {
  /** 选了一行，带着它的值。 */
  (event: 'update:modelValue', value: string): void
  /** 和 `update:modelValue` 同时触发。 */
  (event: 'change', value: string): void
}

export interface TabBarMoreListSlots {
  /** 和交给 TabBar 的同一组 `TabBarItem`。 */
  default?: () => VNodeChild
}

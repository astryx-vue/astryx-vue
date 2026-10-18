import type { Component } from 'vue'

/** 子树里所有链接默认使用的组件，例如 `RouterLink` 或 `NuxtLink`。 */
export type LinkComponentType = Component

export interface LinkProviderProps {
  /**
   * 子树里所有链接元素默认渲染成这个组件，例如 `RouterLink`。
   * 组件会收到 `href` 和 `to`。单个组件自己的 `as` 属性仍然优先。
   */
  component: LinkComponentType
}

export interface LinkProviderSlots {
  /** 使用这个链接组件的子树。 */
  default?: () => unknown
}

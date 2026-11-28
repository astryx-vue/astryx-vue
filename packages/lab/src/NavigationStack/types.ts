import type { VNodeChild } from 'vue'

/** 屏幕标题怎么显示：在栏里（`inline`），或在内容上方显示成大标题（`large`）。 */
export type NavigationTitleDisplayMode = 'large' | 'inline'

export interface NavigationScreenProps {
  /** 屏幕标题：显示在栏里，进入这个屏幕时先读它。 */
  title: string
  /** 压在这个屏幕上面的那一屏，返回按钮读的名字。默认是这个屏幕的 `title`。 */
  backTitle?: string
  /**
   * 标题怎么显示：在栏里（`inline`），或在内容上方显示成大标题（`large`）。
   * 大标题跟内容一起滚，滚到栏下面后换成栏里的标题，和 iOS 的大标题一样。
   * @default 'inline'
   */
  titleDisplayMode?: NavigationTitleDisplayMode
}

export interface NavigationScreenSlots {
  /** 屏幕内容，自己滚动。 */
  default?: () => VNodeChild
  /** 这个屏幕在最上面时，栏尾部的内容。 */
  endContent?: () => VNodeChild
}

export interface NavigationStackProps<T = unknown> {
  /** 压在根屏幕上面的条目，底下的在前。受控，配合 `v-model:path`。 */
  path: readonly T[]
  /** 每个条目一个稳定的 key，屏幕在栈里下移时保住自己的状态。默认用条目的位置。 */
  getKey?: (entry: T, index: number) => string | number
  /** 滑动返回能不能退出一屏。@default true */
  isInteractivePopEnabled?: boolean
  /** 导航区域的无障碍名称。 */
  label?: string
}

export interface NavigationStackSlots<T = unknown> {
  /** 根屏幕：一个 NavigationScreen。 */
  root?: () => VNodeChild
  /** 一个条目的屏幕：一个 NavigationScreen。 */
  screen?: (props: { entry: T, index: number }) => VNodeChild
}

export interface NavigationStackApi<T = unknown> {
  /**
   * 推入一个条目。触发它的控件（正在处理的点击或按键，或 `options.source`）
   * 在这一屏退出时拿回焦点。
   */
  push: (entry: T, options?: { source?: Element | null }) => void
  /** 退出最上面一屏；在根屏幕上什么都不做。 */
  pop: () => void
  /** 一路退回根屏幕。 */
  popToRoot: () => void
  /** 根屏幕上面压了几屏。 */
  readonly depth: number
}

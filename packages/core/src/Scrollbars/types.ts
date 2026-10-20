import type { PartialOptions, ScrollbarsAutoHideBehavior } from 'overlayscrollbars'
import type { MaybeRefOrGetter, Ref } from 'vue'

/** 滚动条自动隐藏的时机：`never` 一直显示，`scroll` 滚动时显示，`leave` 指针离开后隐藏，`move` 指针移动时显示。 */
export type ScrollbarsAutoHide = ScrollbarsAutoHideBehavior

/** 透传给 OverlayScrollbars 的选项。 */
export type ScrollbarsOptions = PartialOptions

export interface ScrollbarsProviderProps {
  /**
   * 子树里是否使用自绘滚动条。设为 `false` 时子树不初始化，已经挂上的会被销毁。
   * 嵌套时内层的 provider 覆盖外层。
   * @default true
   */
  enabled?: boolean
  /**
   * 滚动条自动隐藏的时机。
   * @default 'scroll'
   */
  autoHide?: ScrollbarsAutoHide
  /**
   * 自动隐藏前等待的毫秒数。
   * @default 800
   */
  autoHideDelay?: number
  /**
   * 透传给 OverlayScrollbars 的选项。最后合并，优先级最高。
   */
  options?: ScrollbarsOptions
}

export interface ScrollbarsProviderSlots {
  /** 使用自绘滚动条的子树。 */
  default?: () => unknown
}

export interface UseScrollbarsOptions {
  /**
   * 这个滚动容器自己要不要使用自绘滚动条。外层 provider 关闭时，这里设为 `true` 也不会生效。
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
}

export interface UseScrollbarsResult {
  /** 当前元素上是否已经挂上自绘滚动条。 */
  active: Readonly<Ref<boolean>>
}

/** `mount` 返回的句柄，用来更新选项或销毁滚动条。 */
export interface ScrollbarsHandle {
  /** 用新的选项整体替换当前选项。 */
  update: (options: ScrollbarsOptions) => void
  /** 销毁滚动条，还原元素。 */
  destroy: () => void
}

/** `ScrollbarsProvider` 向子树提供的内容。 */
export interface ScrollbarsContext {
  /** 子树是否开启自绘滚动条。 */
  enabled: Readonly<Ref<boolean>>
  /** 合并后的最终选项。 */
  options: Readonly<Ref<ScrollbarsOptions>>
  /** 在滚动容器上挂自绘滚动条。容器本身就是视口，不会搬动子节点。 */
  mount: (element: HTMLElement, options: ScrollbarsOptions) => ScrollbarsHandle
}

import type { NavLinkComponent } from '../NavItem/types.js'
import type { SpacingStep } from '../Stack/types.js'

export interface OverflowListItem {
  id?: string
  label: string
  href?: string
  iconClass?: string
  isDisabled?: boolean
}

export interface OverflowListProps {
  /** 要排布的项。放不下的会进「更多」菜单。 */
  items: readonly OverflowListItem[]
  /** 项间距，使用间距刻度。 @default 2 */
  gap?: SpacingStep
  /** 至少留下几项。 @default 0 */
  minVisibleItems?: number
  /** 最多留下几项。不传表示只要放得下就都留下。 */
  maxVisibleItems?: number
  /** 最多排几行，剩下的再收起。不传或为 1 时保持一行。 */
  maxRows?: number
  /** 从哪一头开始收。 @default 'end' */
  collapseFrom?: 'start' | 'end'
  /** 用自己的宽度还是父元素的内容宽度来判断放不放得下。 @default 'observeSelf' */
  behavior?: 'observeParent' | 'observeSelf'
  /**
   * 直接指定可见项数，跳过测量。
   * 测试或宽度已经由外部算好时使用。
   */
  visibleCount?: number
  /** 可见项里的链接根组件。 */
  as?: NavLinkComponent
}

export interface OverflowListSlots {
  item?: (props: { item: OverflowListItem, index: number }) => unknown
  overflow?: (props: { items: OverflowListItem[] }) => unknown
}

export interface OverflowListEmits {
  select: [item: OverflowListItem, event: MouseEvent]
}

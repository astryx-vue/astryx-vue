import type { ComputedRef, Ref } from 'vue'

export type TabListSize = 'sm' | 'md' | 'lg'
export type TabListLayout = 'hug' | 'fill'

export interface TabListProps {
  /**
   * Currently selected tab value.
   */
  value: string
  /**
   * Size of the tabs.
   * @default 'md'
   */
  size?: TabListSize
  /**
   * Layout mode for tab sizing.
   * @default 'hug'
   */
  layout?: TabListLayout
  /**
   * Whether to show a bottom divider under the tab list.
   * @default false
   */
  hasDivider?: boolean
}

export interface TabProps {
  /**
   * Unique value for this tab.
   */
  value: string
  /**
   * ID of the controlled panel for aria-controls.
   */
  panelId?: string
  /**
   * Whether the tab is disabled.
   * @default false
   */
  disabled?: boolean
}

export interface TabListTab {
  value: string
  disabled: boolean
  el: HTMLElement
}

/**
 * Tabs read the selection and the sizing from the list, so these stay reactive
 * refs instead of plain values: a snapshot would leave every tab stuck on the
 * selection captured when the list was provided.
 */
export interface TabListContextValue {
  value: ComputedRef<string>
  size: ComputedRef<TabListSize>
  layout: ComputedRef<TabListLayout>
  hasDivider: ComputedRef<boolean>
  tabs: TabListTab[]
  focusedValue: Ref<string>
  registerTab: (tab: TabListTab) => void
  unregisterTab: (value: string) => void
  selectTab: (value: string) => void
  moveFocus: (direction: 'next' | 'prev' | 'first' | 'last', value: string) => void
}

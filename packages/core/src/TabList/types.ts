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

export interface TabListContextValue {
  value: string
  size: TabListSize
  layout: TabListLayout
  hasDivider: boolean
  tabs: TabListTab[]
  focusedValue: string
  registerTab: (tab: TabListTab) => void
  unregisterTab: (value: string) => void
  selectTab: (value: string) => void
  moveFocus: (direction: 'next' | 'prev' | 'first' | 'last', value: string) => void
}

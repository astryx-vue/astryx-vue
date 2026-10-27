import type { ComputedRef, Ref } from 'vue'
import type { NavLinkComponent } from '../NavItem/types.js'

export type TabListSize = 'sm' | 'md' | 'lg'
export type TabListLayout = 'hug' | 'fill'
export type TabListEdgeCompensation = 'inline'
export type TabListOverflow = 'auto' | 'scroll' | 'visible'

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
  /**
   * Stretch the strip to the container's inline content edges, cancelling
   * `--container-padding-inline-*`, while the first and last labels stay on
   * the content inset. `edgeCompensation="inline"` is the same mode and wins
   * when both are set.
   * @default false
   */
  isFullBleed?: boolean
  /**
   * Canonical name for the inline bleed. `isFullBleed` selects the same mode
   * when this is omitted.
   */
  edgeCompensation?: TabListEdgeCompensation
  /**
   * What happens when the tabs are wider than the strip.
   * `auto` and `scroll` scroll horizontally, fade the hidden edge, and offer
   * arrow buttons. `visible` leaves the tabs at their own width.
   * The selected tab is scrolled back into view.
   * @default 'auto'
   */
  overflow?: TabListOverflow
  /**
   * ARIA role for the strip.
   *
   * `tablist` asks for the WAI-ARIA tabs pattern: `role="tab"` and
   * `aria-selected` on every tab, and each tab points at the panel it
   * controls through its `panelId`. Only tabs belong in a tablist strip, and
   * a tab's `href` is ignored there.
   *
   * Left unset, the strip is a navigation landmark that marks the current tab
   * with `aria-current`, and tabs with an `href` render as links.
   *
   * Any other value is passed through to the element unchanged.
   */
  role?: string
}

export interface TabMenuOption {
  value: string
  label: string
  /** CSS icon class, for example `i-carbon-settings`. */
  iconClass?: string
}

export interface TabMenuProps {
  /**
   * Trigger text when none of the options is the selected tab, and the
   * accessible name of the menu.
   */
  label: string
  /** Secondary tabs collected behind the trigger. */
  options: TabMenuOption[]
}

export interface TabProps {
  /**
   * Unique value for this tab.
   */
  value: string
  /**
   * Visible text of the tab. Used as `aria-label` when `isLabelHidden` is set.
   * The default slot wins when both are given.
   */
  label?: string
  /**
   * ID of the controlled panel for aria-controls.
   * Only used inside a `role="tablist"` strip.
   */
  panelId?: string
  /**
   * Whether the tab is disabled.
   * @default false
   */
  disabled?: boolean
  /**
   * URL to navigate to. Outside the tabs pattern the tab renders as a link.
   * Ignored inside a `role="tablist"` strip.
   */
  href?: string
  /**
   * Link root component, such as a router link. Only applies when `href` is
   * given and the strip is not a tablist.
   */
  as?: NavLinkComponent
  /**
   * Visually hides the label. Only the icon and the end content show, and
   * `label` becomes the accessible name.
   * @default false
   */
  isLabelHidden?: boolean
}

export interface TabSlots {
  /** Visible text. Falls back to the `label` prop. */
  default?: () => unknown
  /** Icon shown while the tab is not selected. */
  icon?: () => unknown
  /** Icon shown while the tab is selected. Falls back to `icon`. */
  selectedIcon?: () => unknown
  /** Content after the label, such as a badge count or a status dot. */
  endContent?: () => unknown
}

export interface TabListTab {
  value: string
  disabled: boolean
  el: HTMLElement
  /**
   * When false, arrowing onto this stop focuses it without changing the
   * selected value. TabMenu uses that so the overflow trigger is in the
   * roving order without becoming a tab value of its own.
   */
  selectsOnFocus?: boolean
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
  /** Whether the strip speaks the WAI-ARIA tabs pattern (`role="tablist"`). */
  isTabsPattern: ComputedRef<boolean>
  tabs: TabListTab[]
  focusedValue: Ref<string>
  registerTab: (tab: TabListTab) => void
  unregisterTab: (value: string) => void
  selectTab: (value: string) => void
  moveFocus: (direction: 'next' | 'prev' | 'first' | 'last', value: string) => void
}

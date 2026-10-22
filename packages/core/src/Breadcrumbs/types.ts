import type { ComputedRef } from 'vue'
import type { DropdownMenuOption, DropdownMenuSize } from '../DropdownMenu/types.js'
import type { NavLinkComponent } from '../NavItem/types.js'

export type BreadcrumbsVariant = 'default' | 'supporting'

export type BreadcrumbMenuOption = DropdownMenuOption

export interface BreadcrumbsProps {
  /**
   * Separator rendered between items. Decorative only.
   * @default '/'
   */
  separator?: string
  /**
   * Visual variant for the breadcrumb trail.
   * @default 'default'
   */
  variant?: BreadcrumbsVariant
  /**
   * Accessible label for the nav landmark.
   * @default 'Breadcrumb'
   */
  label?: string
}

export interface BreadcrumbItemProps {
  /**
   * URL for the breadcrumb link. Omit for the current page.
   * Mutually exclusive with `menu`: a menu crumb is a trigger, not a link.
   */
  href?: string
  /**
   * Link root component, such as a router link. Used instead of `a` for
   * non-current items that have an `href`.
   */
  as?: NavLinkComponent
  /**
   * Marks this item as the current page. Renders as a span with aria-current="page".
   * A current crumb can still open `menu`.
   */
  isCurrent?: boolean
  /**
   * Turns the crumb into a menu trigger for sibling destinations.
   * Uses the same item objects as DropdownMenu, including `{ type: 'divider' }`.
   */
  menu?: BreadcrumbMenuOption[]
  /**
   * Size of the menu items. Defaults to `sm` on the supporting variant and `md` otherwise.
   */
  menuSize?: DropdownMenuSize
}

/**
 * Breadcrumb items read the trail styling from the list, so these stay
 * reactive refs instead of plain values.
 */
export interface BreadcrumbContextValue {
  variant: ComputedRef<BreadcrumbsVariant>
  separator: ComputedRef<string>
  /** 没有人声明当前项时，最后一项的 id。有人声明时是 null。 */
  autoCurrentId: ComputedRef<string | null>
  registerItem: (id: string, explicit: boolean | undefined) => void
  updateItem: (id: string, explicit: boolean | undefined) => void
  unregisterItem: (id: string) => void
}

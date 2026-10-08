import type { ComputedRef } from 'vue'

export type BreadcrumbsVariant = 'default' | 'supporting'

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
   */
  href?: string
  /**
   * Marks this item as the current page. Renders as a span with aria-current="page".
   */
  isCurrent?: boolean
}

/**
 * Breadcrumb items read the trail styling from the list, so these stay
 * reactive refs instead of plain values.
 */
export interface BreadcrumbContextValue {
  variant: ComputedRef<BreadcrumbsVariant>
  separator: ComputedRef<string>
}

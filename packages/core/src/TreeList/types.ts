import type { VNode } from 'vue'

export type TreeListDensity = 'compact' | 'balanced' | 'spacious'
export type TreeListVariant = 'lineGuides' | 'noGuides'

export interface TreeListItemData {
  id: string
  label: string
  description?: string
  /** Glyph name, or a CSS icon class starting with `i-`. */
  icon?: string
  /** Trailing glyph or CSS icon class. */
  endIcon?: string
  /** Compact trailing badge, for counts. */
  badge?: string
  children?: TreeListItemData[]
  href?: string
  target?: string
  isDisabled?: boolean
  isSelected?: boolean
  isExpanded?: boolean
  onClick?: (event: MouseEvent) => void
}

export interface TreeListProps {
  items: TreeListItemData[]
  /** @default 'balanced' */
  density?: TreeListDensity
  /** @default 'lineGuides' */
  variant?: TreeListVariant
  header?: string
  label?: string
}

export interface TreeListSlots {
  header?: () => VNode[]
  start?: (props: { item: TreeListItemData }) => VNode[]
  end?: (props: { item: TreeListItemData }) => VNode[]
}

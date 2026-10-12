import type { VNode } from 'vue'

export type MetadataListColumns = 'multi' | 'single' | number
export type MetadataListOrientation = 'vertical' | 'horizontal'
export type MetadataListLabelPosition = 'start' | 'top'

export interface MetadataListLabelConfig {
  /** `start` puts the label beside the value. `top` stacks it above. */
  position?: MetadataListLabelPosition
  /** Label track width. Numbers are pixels. Only applies to side labels. */
  width?: number | string
}

export interface MetadataListProps {
  columns?: MetadataListColumns
  label?: MetadataListLabelConfig
  /** Collapse items past this count behind a show more control. Ignored when horizontal. */
  maxNumOfItems?: number
  /**
   * `horizontal` flows items in a wrapping row and ignores `columns`, `label`,
   * and `maxNumOfItems`.
   * @default 'vertical'
   */
  orientation?: MetadataListOrientation
  title?: string
}

export interface MetadataListSlots {
  default?: () => VNode[]
  title?: () => VNode[]
}

export interface MetadataListItemProps {
  label: string
}

export interface MetadataListItemSlots {
  default?: () => VNode[]
  icon?: () => VNode[]
}

export interface MetadataListContextValue {
  labelPosition: MetadataListLabelPosition
  orientation: MetadataListOrientation
}

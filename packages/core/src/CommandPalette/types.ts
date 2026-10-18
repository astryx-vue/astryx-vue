import type { VNode } from 'vue'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'

export interface CommandPaletteProps<T extends SearchableItem = SearchableItem> {
  /** Whether the palette is open. */
  isOpen: boolean
  /** Where commands come from. An empty query calls `bootstrap`. */
  searchSource: SearchSource<T>
  /**
   * Render in the page flow instead of a modal dialog. Docs use this for the
   * preview.
   * @default false
   */
  isInline?: boolean
  /** Accessible name of the dialog. */
  label?: string
  /** @default 640 */
  width?: number | string
  /** @default 480 */
  maxHeight?: number | string
  /** Shown when a query returns nothing. */
  emptySearchText?: string
  /** Shown before the source has anything to list. */
  emptyBootstrapText?: string
  /**
   * Selected id in picker mode. Bind with `v-model:value`.
   */
  value?: string
}

export interface CommandPaletteEmits {
  openChange: [isOpen: boolean]
  /** Selected value in picker mode. `onValueChange` in the original API. */
  valueChange: [value: string]
}

export interface CommandPaletteItemSlotProps<T extends SearchableItem = SearchableItem> {
  item: T
  isSelected: boolean
}

export interface CommandPaletteSlots<T extends SearchableItem = SearchableItem> {
  input?: () => VNode[]
  footer?: () => VNode[]
  item?: (props: CommandPaletteItemSlotProps<T>) => VNode[]
}

export interface CommandPaletteInputProps {
  placeholder?: string
  label?: string
  /** @default true */
  hasAutoFocus?: boolean
  /**
   * Search value. Bind with `v-model:value`.
   * Read from the surrounding CommandPalette when omitted.
   */
  value?: string
}

export interface CommandPaletteInputEmits {
  /** Next search value. Fired by `onValueChange` in the original API. */
  'valueChange': [value: string]
  'update:value': [value: string]
}

export interface CommandPaletteListProps {
  label?: string
}

export interface CommandPaletteGroupProps {
  heading: string
}

export interface CommandPaletteItemProps {
  value: string
  isDisabled?: boolean
  /**
   * Whether this item is the active keyboard result.
   * Derived from the surrounding CommandPalette when omitted.
   * @default false
   */
  isHighlighted?: boolean
  /**
   * Whether this item represents the selected value in picker mode.
   * Derived from the surrounding CommandPalette when omitted.
   * @default false
   */
  isSelected?: boolean
}

export interface CommandPaletteItemEmits {
  /** Fired after the item is activated by pointer. */
  select: [value: string]
}

import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'

export type CommandPaletteHighlightCause = 'keyboard' | 'pointer' | 'sync'

export interface CommandPaletteContextValue {
  search: Ref<string>
  setSearch: (value: string) => void
  highlightedIndex: Ref<number>
  highlightCause: Ref<CommandPaletteHighlightCause>
  setHighlightedIndex: (index: number, cause?: CommandPaletteHighlightCause) => void
  items: ComputedRef<SearchableItem[]>
  listId: string
  value: ComputedRef<string | undefined>
  isBusy: ComputedRef<boolean>
  isInline: ComputedRef<boolean>
  selectItem: (item: SearchableItem) => void
  onKeyDown: (event: KeyboardEvent) => void
}

export const commandPaletteKey: InjectionKey<CommandPaletteContextValue> = Symbol('commandPalette')

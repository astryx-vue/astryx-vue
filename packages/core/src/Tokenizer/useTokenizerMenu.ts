import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerMessages } from '../locale/messages/tokenizer.js'
import type { LatchedOptionGrid } from '../selectors/useLatchedOptionGrid.js'
import type { AnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import type { TypeaheadMenu, TypeaheadMenuEntry } from '../Typeahead/useTypeaheadMenu.js'
import type { TypeaheadMenuConfigApi } from '../Typeahead/useTypeaheadMenuConfig.js'
import type { TokenizerProps } from './types.js'
import { computed, nextTick, watch } from 'vue'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { useLatchedOptionGrid } from '../selectors/useLatchedOptionGrid.js'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadAnnouncement } from '../Typeahead/useTypeaheadAnnouncement.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { useTypeaheadMenuConfig } from '../Typeahead/useTypeaheadMenuConfig.js'

export interface TokenizerMenuOptions<T extends SearchableItem> {
  props: TokenizerProps<T>
  /** 自己禁用，或所在的 InputGroup 禁用。 */
  isDisabled: () => boolean
  values: ComputedRef<readonly T[]>
  atMax: ComputedRef<boolean>
  showsEntriesOnFocus: ComputedRef<boolean>
  isCreatable: ComputedRef<boolean>
  emptyText: ComputedRef<string>
  messages: () => TokenizerMessages
  listboxId: string
  anchorRef: Readonly<Ref<HTMLElement | null>>
  inputRef: Readonly<Ref<HTMLInputElement | null>>
  popupEl: () => HTMLElement | null
  onSelect: (entry: TypeaheadMenuEntry<T>) => void
  onQueryChange: (query: string) => void
  onOpenChange: (isOpen: boolean) => void
}

export interface TokenizerMenu<T extends SearchableItem> {
  menu: TypeaheadMenu<T>
  menuConfig: TypeaheadMenuConfigApi
  anchored: AnchoredListbox
  optionGrid: LatchedOptionGrid
  listboxRef: ComputedRef<HTMLElement | null>
  /** 指针移到一行上：可选的行变成高亮。 */
  highlight: (index: number) => void
  /** 在菜单里选中一行。 */
  selectById: (id: string) => void
}

/** 行内呈现的结果菜单：搜索、播报、菜单配置、锚定位置和选项网格。 */
export function useTokenizerMenu<T extends SearchableItem>(options: TokenizerMenuOptions<T>): TokenizerMenu<T> {
  const { props, values, atMax, showsEntriesOnFocus, inputRef } = options
  const listboxRef = computed(() => options.popupEl())
  useScrollbars(listboxRef)

  const menu = useTypeaheadMenu<T>({
    source: () => props.searchSource,
    debounceMs: () => props.debounceMs ?? 150,
    showOnFocus: () => showsEntriesOnFocus.value && !atMax.value,
    minQueryLength: () => props.minQueryLength ?? 1,
    maxItems: () => props.maxMenuItems ?? 10,
    disabled: () => options.isDisabled() || atMax.value || props.menu?.role === 'dialog',
    excludeIds: () => values.value.map(item => item.id),
    blockedLabels: () => values.value.map(item => item.label),
    creatable: () => options.isCreatable.value && !atMax.value,
    createLabel: query => options.messages().create(query),
    onSelect: options.onSelect,
    onQueryChange: options.onQueryChange,
  })

  /** 搜索忙碌时由输入框念一次「加载中」；列表里的转圈只是装饰。 */
  const settleBusy = useBusyAnnouncement(() => menu.status.value === 'loading', () => options.messages().loading, inputRef)

  useTypeaheadAnnouncement({
    menu,
    settleBusy,
    emptyText: () => options.emptyText.value,
    emptySearchText: () => options.emptyText.value,
    resultCount: count => options.messages().resultCount(count),
  })

  const menuConfig = useTypeaheadMenuConfig({
    config: () => props.menu,
    popupEl: () => listboxRef.value,
    inputEl: () => inputRef.value,
    listbox: { isOpen: menu.combobox.isOpen, open: () => menu.open(), close: () => menu.close() },
    isDisabled: () => options.isDisabled(),
    canOpenList: () => showsEntriesOnFocus.value || menu.query.value !== '',
  })

  const anchored = useAnchoredListbox({
    anchor: options.anchorRef,
    layer: listboxRef,
    isOpen: menuConfig.popupOpen,
    menuWidth: () => props.menuWidth,
    onDismiss: () => menuConfig.isDialog.value ? menuConfig.dismiss() : menu.close(),
  })

  watch(menuConfig.popupOpen, isOpen => options.onOpenChange(isOpen))

  watch(() => menu.combobox.activeIndex.value, (index) => {
    if (!menu.combobox.isOpen.value || index < 0)
      return
    void nextTick(() => scrollOptionIntoView(listboxRef.value, menu.entries.value[index]?.id))
  })

  const optionGrid = useLatchedOptionGrid({
    entries: () => menu.entries.value,
    isOpen: () => menu.combobox.isOpen.value,
    activeIndex: menu.combobox.activeIndex,
    getListbox: () => listboxRef.value,
    listboxId: () => options.listboxId,
  })

  function highlight(index: number): void {
    const entry = menu.entries.value[index]
    if (entry && !entry.disabled)
      menu.combobox.activeIndex.value = index
  }

  function selectById(id: string): void {
    const entry = menu.entries.value.find(item => item.id === id)
    if (entry && !entry.disabled)
      options.onSelect(entry)
  }

  return { menu, menuConfig, anchored, optionGrid, listboxRef, highlight, selectById }
}

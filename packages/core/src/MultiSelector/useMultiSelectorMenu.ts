import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { Combobox } from '../composables/useCombobox.js'
import type { AstryxMessages } from '../locale/messages.js'
import type { OptionActionGrid } from '../selectors/useOptionActionGrid.js'
import type { MultiSelectorCreateChange, MultiSelectorOptionData, MultiSelectorProps } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { useCombobox } from '../composables/useCombobox.js'
import { searchResultMessage } from '../Selector/searchResultMessage.js'
import { isOptionAction } from '../selectors/optionAction.js'
import { useOptionActionGrid } from '../selectors/useOptionActionGrid.js'
import { scrollOptionIntoView } from '../Typeahead/useAnchoredListbox.js'
import { isImeKeyEvent } from '../utils/ime.js'
import { createOptionValue, readCreateQuery, resolveCreateQuery } from './createOption.js'
import { applyMultiSelectorKey } from './multiSelectorKeyboard.js'
import { flattenOptions, SELECT_ALL_VALUE } from './options.js'

export interface MultiSelectorMenuHost {
  props: MultiSelectorProps
  emitUpdate: (value: (string | number)[]) => void
  emitChange: (value: (string | number)[], change?: MultiSelectorCreateChange) => void
  emitSearch: (query: string) => void
  emitOpenChange: (isOpen: boolean) => void
  canActivate: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  messages: ComputedRef<AstryxMessages>
  announce: (message: string) => void
  listboxRef: Readonly<ShallowRef<HTMLElement | null>>
  getSearchInput: () => HTMLInputElement | null
  focusTrigger: () => void
  listboxId: string
}

export interface MultiSelectorMenuApi {
  query: Ref<string>
  combobox: Combobox<string | number>
  rows: ComputedRef<ReturnType<typeof flattenOptions>>
  createOption: ComputedRef<MultiSelectorOptionData | null>
  selectAllIndex: ComputedRef<number>
  selectAllLabel: ComputedRef<string>
  selectAllState: ComputedRef<'checked' | 'unchecked' | 'indeterminate'>
  selectedValues: ComputedRef<readonly (string | number)[]>
  selectedOptions: ComputedRef<MultiSelectorOptionData[]>
  realMatchCount: ComputedRef<number>
  showEmpty: ComputedRef<boolean>
  emptyText: ComputedRef<string>
  emptySearchText: ComputedRef<string>
  searchPlaceholder: ComputedRef<string>
  gridMode: ComputedRef<boolean>
  actionGrid: OptionActionGrid
  popupKind: ComputedRef<'dialog' | 'grid' | 'listbox'>
  optionDomId: (index: number) => string
  optionIndex: (value: string | number) => number
  isSelected: (value: string | number) => boolean
  toggleValue: (value: string | number) => void
  highlight: (index: number) => void
  checkboxState: (option: MultiSelectorOptionData) => 'checked' | 'unchecked' | 'indeterminate'
  commit: (next: (string | number)[], change?: MultiSelectorCreateChange) => void
  onKeyDown: (event: KeyboardEvent) => void
  onSearchInput: (event: Event) => void
  openFromMount: () => void
  open: () => void
  close: () => void
}

/** 多选面板的列表、创建行和选项操作。触发器自己的展示留在组件里。 */
export function useMultiSelectorMenu(host: MultiSelectorMenuHost): MultiSelectorMenuApi {
  const query = ref('')
  const selectedValues = computed(() => host.props.modelValue ?? [])
  const searchPlaceholder = computed(() => host.props.searchPlaceholder ?? host.messages.value.multiSelector.search)
  const selectAllLabel = computed(() => host.props.selectAllLabel ?? host.messages.value.multiSelector.selectAll)
  const emptyText = computed(() => host.props.emptyText ?? host.messages.value.multiSelector.empty)
  const emptySearchText = computed(() => host.props.emptySearchText ?? host.messages.value.multiSelector.emptySearch)
  const rows = computed(() => flattenOptions(host.props.options, query.value))
  const optionByValue = computed(() => {
    const map = new Map<string | number, MultiSelectorOptionData>()
    for (const row of flattenOptions(host.props.options, '')) {
      if (row.kind === 'option' && row.option)
        map.set(row.option.value, row.option)
    }
    return map
  })
  const createQuery = computed(() => resolveCreateQuery({
    enabled: host.props.hasCreate === true && host.props.searchable === true && !host.isLoading.value,
    query: query.value,
    labels: [...optionByValue.value.values()].map(option => option.label),
  }))
  const createOption = computed<MultiSelectorOptionData | null>(() => {
    if (createQuery.value == null)
      return null
    return {
      value: createOptionValue(createQuery.value),
      label: host.messages.value.multiSelector.create(createQuery.value),
    }
  })
  const selectable = computed<MultiSelectorOptionData[]>(() => {
    const items = rows.value.flatMap(row => row.kind === 'option' && row.option ? [row.option] : [])
    const head: MultiSelectorOptionData[] = []
    if (createOption.value)
      head.push(createOption.value)
    if (host.props.selectAll)
      head.push({ value: SELECT_ALL_VALUE, label: selectAllLabel.value })
    return [...head, ...items]
  })
  const comboboxOptions = computed(() => selectable.value.map(option => ({
    value: option.value,
    label: option.label,
    disabled: option.disabled ?? false,
    description: option.description,
  })))
  const dummyValue = ref<string | number | null>(null)
  let openingFromMount = false
  const selectAllIndex = computed(() => host.props.selectAll ? (createOption.value ? 1 : 0) : -1)
  const combobox = useCombobox({
    options: comboboxOptions,
    modelValue: dummyValue,
    isEnabled: host.canActivate,
    isSearchable: ref(false),
    onChange: () => {},
    onOpenChange: (isOpen) => {
      host.emitOpenChange(isOpen)
      if (isOpen && host.props.searchable && !openingFromMount)
        void nextTick(() => host.getSearchInput()?.focus())
      if (!isOpen)
        query.value = ''
    },
  })

  const selectedOptions = computed(() => selectedValues.value.flatMap((value) => {
    const option = optionByValue.value.get(value)
    return option ? [option] : []
  }))
  const enabledValues = computed(() => selectable.value.filter(option => option.value !== SELECT_ALL_VALUE && readCreateQuery(option.value) == null && !option.disabled).map(option => option.value))
  const selectedEnabledCount = computed(() => enabledValues.value.filter(value => selectedValues.value.includes(value)).length)
  const selectAllState = computed(() => {
    if (selectedEnabledCount.value === 0)
      return 'unchecked' as const
    if (selectedEnabledCount.value === enabledValues.value.length)
      return 'checked' as const
    return 'indeterminate' as const
  })
  const realMatchCount = computed(() => rows.value.filter(row => row.kind === 'option').length)
  const showEmpty = computed(() => !host.isLoading.value && realMatchCount.value === 0 && createOption.value == null)
  const announcement = computed(() => searchResultMessage({
    isOpen: combobox.isOpen.value,
    isLoading: host.isLoading.value,
    query: query.value,
    matchCount: realMatchCount.value,
    hasCreateRow: createOption.value != null,
    emptyText: emptyText.value,
    emptySearchText: emptySearchText.value,
    resultCount: host.messages.value.multiSelector.resultCount,
  }))

  const gridLatched = ref(false)
  watch(optionByValue, (map) => {
    if ([...map.values()].some(option => isOptionAction(option.action)))
      gridLatched.value = true
  }, { immediate: true })
  const gridMode = computed(() => gridLatched.value)

  function optionDomId(index: number): string {
    return `${host.listboxId}-option-${index}`
  }

  function actionDomId(index: number): string {
    return `${host.listboxId}-action-${index}`
  }

  function rowHasAction(index: number): boolean {
    const option = selectable.value[index]
    if (option == null)
      return false
    return isOptionAction(optionByValue.value.get(option.value)?.action)
  }

  const actionGrid = useOptionActionGrid({
    enabled: () => gridMode.value,
    isOpen: () => combobox.isOpen.value,
    activeIndex: combobox.activeIndex,
    rowHasAction,
    getListbox: () => host.listboxRef.value,
    optionId: optionDomId,
    actionId: actionDomId,
  })

  const popupKind = computed(() => {
    if (host.props.presentation === 'bottom-sheet')
      return 'dialog' as const
    return gridMode.value ? 'grid' as const : 'listbox' as const
  })

  watch(query, (value) => {
    host.emitSearch(value)
    if (combobox.isOpen.value)
      combobox.highlightFirst()
  })

  watch(announcement, (message) => {
    if (message)
      host.announce(message)
  })

  watch(() => [host.props.hasCreate, host.props.searchable] as const, ([create, search]) => {
    const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
    if (create && !search && dev)
      console.warn('[MultiSelector] hasCreate 需要同时开启 searchable，否则不会出现创建行。')
  }, { immediate: true })

  watch(() => combobox.activeIndex.value, (index) => {
    if (!combobox.isOpen.value || index < 0)
      return
    const option = selectable.value[index]
    void nextTick(() => scrollOptionIntoView(host.listboxRef.value, option ? String(option.value) : undefined))
  })

  function commit(next: (string | number)[], change?: MultiSelectorCreateChange): void {
    host.emitUpdate(next)
    host.emitChange(next, change)
  }

  function commitCreate(created: string): void {
    const next = [...selectedValues.value, created]
    commit(next, { type: 'create', query: created })
    host.announce(host.messages.value.multiSelector.created(created))
    query.value = ''
  }

  function isSelected(value: string | number): boolean {
    return selectedValues.value.includes(value)
  }

  function toggleValue(value: string | number): void {
    if (!host.canActivate.value || host.isLoading.value)
      return
    const created = readCreateQuery(value)
    if (created != null) {
      commitCreate(created)
      return
    }
    if (value === SELECT_ALL_VALUE) {
      const allOn = selectAllState.value === 'checked'
      const enabled = new Set(enabledValues.value)
      commit(allOn ? selectedValues.value.filter(item => !enabled.has(item)) : [...new Set([...selectedValues.value, ...enabledValues.value])])
      return
    }
    const option = optionByValue.value.get(value)
    if (option?.disabled)
      return
    commit(isSelected(value) ? selectedValues.value.filter(item => item !== value) : [...selectedValues.value, value])
  }

  function optionIndex(value: string | number): number {
    return selectable.value.findIndex(option => option.value === value)
  }

  function highlight(index: number): void {
    const option = selectable.value[index]
    if (option && !option.disabled)
      combobox.activeIndex.value = index
  }

  function checkboxState(option: MultiSelectorOptionData): 'checked' | 'unchecked' | 'indeterminate' {
    if (option.value === SELECT_ALL_VALUE)
      return selectAllState.value
    return isSelected(option.value) ? 'checked' as const : 'unchecked' as const
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (isImeKeyEvent(event) || event.isComposing)
      return
    if (actionGrid.onKeyDown(event))
      return
    applyMultiSelectorKey(event, {
      canActivate: host.canActivate.value,
      searchable: host.props.searchable === true,
      isOpen: combobox.isOpen.value,
      activeIndex: combobox.activeIndex.value,
      createQuery: createQuery.value,
      selectedCount: selectedValues.value.length,
      optionAt: index => selectable.value[index],
      open: () => combobox.open(),
      close: () => combobox.close(),
      highlightNext: () => combobox.highlightNext(),
      highlightPrevious: () => combobox.highlightPrevious(),
      highlightFirst: () => combobox.highlightFirst(),
      highlightLast: () => combobox.highlightLast(),
      jumpToMatch: char => combobox.jumpToMatch(char),
      toggleValue,
      commitCreate,
      clearSelection: () => commit([]),
      focusTrigger: host.focusTrigger,
    })
  }

  function openFromMount(): void {
    openingFromMount = true
    if (host.canActivate.value)
      combobox.open()
    openingFromMount = false
  }

  function onSearchInput(event: Event): void {
    query.value = (event.target as HTMLInputElement).value
  }

  return {
    query,
    combobox,
    rows,
    createOption,
    selectAllIndex,
    selectAllLabel,
    selectAllState,
    selectedValues,
    selectedOptions,
    realMatchCount,
    showEmpty,
    emptyText,
    emptySearchText,
    searchPlaceholder,
    gridMode,
    actionGrid,
    popupKind,
    optionDomId,
    optionIndex,
    isSelected,
    toggleValue,
    highlight,
    checkboxState,
    commit,
    onKeyDown,
    onSearchInput,
    openFromMount,
    open: () => {
      if (host.canActivate.value)
        combobox.open()
    },
    close: () => combobox.close(),
  }
}

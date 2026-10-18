import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import type { AsyncSourceStatus, SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { Combobox } from '../composables/useCombobox.js'
import { computed, ref, toValue, watch } from 'vue'
import { useAsyncSource } from '../composables/useAsyncSource.js'
import { useCombobox } from '../composables/useCombobox.js'
import { isBelowMinQueryLength } from './queryLength.js'

export interface TypeaheadMenuEntry<T extends SearchableItem = SearchableItem> {
  item: T
  id: string
  label: string
  description?: string
  disabled?: boolean
  /** 分组标题。来自条目的 `auxiliaryData.group`。 */
  group?: string
  /** 用户正在创建的新条目，不来自数据源。 */
  create?: boolean
}

/** 分组标题放在 `auxiliaryData.group` 上，和上游一致。 */
function entryGroup(item: SearchableItem): string | undefined {
  const aux = item.auxiliaryData
  if (aux == null || typeof aux !== 'object')
    return undefined
  const group = (aux as { group?: unknown }).group
  return typeof group === 'string' && group !== '' ? group : undefined
}

export interface UseTypeaheadMenuOptions<T extends SearchableItem = SearchableItem> {
  source: MaybeRefOrGetter<SearchSource<T>>
  debounceMs?: MaybeRefOrGetter<number>
  showOnFocus?: MaybeRefOrGetter<boolean>
  minQueryLength?: MaybeRefOrGetter<number>
  maxItems?: MaybeRefOrGetter<number>
  disabled?: MaybeRefOrGetter<boolean>
  excludeIds?: MaybeRefOrGetter<readonly string[]>
  blockedLabels?: MaybeRefOrGetter<readonly string[]>
  creatable?: MaybeRefOrGetter<boolean>
  /** 不要包成 getter。toValue 会把函数当成 getter 直接调用。 */
  createLabel?: (query: string) => string
  onSelect: (entry: TypeaheadMenuEntry<T>) => void
  onEscape?: () => void
  onQueryChange?: (query: string) => void
}

function isEditableTarget(event: KeyboardEvent): boolean {
  const target = event.target
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
}

export interface TypeaheadMenu<T extends SearchableItem = SearchableItem> {
  query: Ref<string>
  combobox: Combobox<string>
  entries: ComputedRef<TypeaheadMenuEntry<T>[]>
  status: Ref<AsyncSourceStatus>
  error: ShallowRef<unknown>
  activeId: ComputedRef<string | undefined>
  /** 输入还没到够搜的长度：此时不搜，下拉也不打开。 */
  belowMinQueryLength: ComputedRef<boolean>
  setQuery: (value: string) => void
  open: () => void
  close: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * 搜索菜单：useAsyncSource 负责数据，useCombobox 负责高亮和开关。
 * 键盘在这里处理，避免 combobox 把空格当成选中。
 */
export function useTypeaheadMenu<T extends SearchableItem>(options: UseTypeaheadMenuOptions<T>): TypeaheadMenu<T> {
  const query = ref('')
  const menuOpen = ref(false)
  const minQueryLength = computed(() => toValue(options.minQueryLength) ?? 1)
  const belowMinQueryLength = computed(() => isBelowMinQueryLength(query.value, minQueryLength.value))
  const asyncSource = useAsyncSource<T>({
    source: options.source,
    query,
    // 太短的查询不去打数据源，下拉里也就没有属于这次输入的结果。
    enabled: computed(() => menuOpen.value && !belowMinQueryLength.value),
    debounceMs: options.debounceMs,
  })

  const entries = computed<TypeaheadMenuEntry<T>[]>(() => {
    const excluded = new Set(toValue(options.excludeIds) ?? [])
    const blocked = new Set((toValue(options.blockedLabels) ?? []).map(label => label.toLowerCase()))
    const max = toValue(options.maxItems) ?? 10
    // 查询太短就没有属于这次输入的结果；从文字派生的条目另外拼在后面。
    const list = belowMinQueryLength.value
      ? []
      : asyncSource.items.value
          .filter(item => !excluded.has(item.id))
          .slice(0, max)
          .map<TypeaheadMenuEntry<T>>(item => ({
            item,
            id: item.id,
            label: item.label,
            description: item.description,
            disabled: item.disabled,
            group: entryGroup(item),
          }))

    const text = query.value.trim()
    if (toValue(options.creatable) && text !== '') {
      const taken = list.some(entry => entry.label.toLowerCase() === text.toLowerCase())
        || excluded.has(text)
        || blocked.has(text.toLowerCase())
      if (!taken) {
        const created = { id: text, label: text } as T
        list.push({
          item: created,
          id: `__create__:${text}`,
          label: options.createLabel ? options.createLabel(text) : text,
          create: true,
        })
      }
    }
    return list
  })

  const comboboxOptions = computed(() => entries.value.map(entry => ({
    value: entry.id,
    label: entry.label,
    disabled: entry.disabled ?? false,
    description: entry.description,
  })))

  const modelValue = ref<string | null>(null)
  const combobox = useCombobox({
    options: comboboxOptions,
    modelValue,
    isEnabled: computed(() => !toValue(options.disabled)),
    isSearchable: ref(false),
    onChange: () => {},
    onOpenChange: (isOpen) => {
      menuOpen.value = isOpen
    },
  })

  watch(entries, (list) => {
    if (!combobox.isOpen.value || list.length === 0)
      return
    const current = list[combobox.activeIndex.value]
    if (!current || current.disabled)
      combobox.highlightFirst()
  })

  /**
   * 太短的查询没东西可展示，此时不让下拉打开。
   * 只有从文字自己派生的条目（比如「创建 xxx」）还值得看一眼。
   */
  function canOpen(): boolean {
    if (!belowMinQueryLength.value)
      return true
    return entries.value.length > 0
  }

  function open(): void {
    if (toValue(options.disabled) || combobox.isOpen.value || !canOpen())
      return
    combobox.open()
  }

  function close(): void {
    if (!combobox.isOpen.value)
      return
    combobox.close()
  }

  function setQuery(value: string): void {
    query.value = value
    options.onQueryChange?.(value)
    if (toValue(options.disabled))
      return
    if (belowMinQueryLength.value) {
      // 不搜，也不显示「没有结果」——这个查询根本没搜过。
      if (entries.value.length > 0)
        open()
      else
        close()
      return
    }
    if (value.length > 0 || toValue(options.showOnFocus))
      open()
    else
      close()
  }

  function selectHighlighted(): void {
    const entry = entries.value[combobox.activeIndex.value]
    if (entry && !entry.disabled)
      options.onSelect(entry)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.isComposing || event.key === 'Process')
      return
    if (toValue(options.disabled))
      return

    const openNow = combobox.isOpen.value
    const list = entries.value

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!openNow) {
          if (query.value.length > 0 || toValue(options.showOnFocus))
            open()
        }
        else if (list.length > 0) {
          combobox.highlightNext()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!openNow) {
          if (query.value.length > 0 || toValue(options.showOnFocus)) {
            open()
            combobox.highlightLast()
          }
        }
        else if (list.length > 0) {
          combobox.highlightPrevious()
        }
        break
      case 'Home':
        if (openNow && list.length > 0 && !isEditableTarget(event)) {
          event.preventDefault()
          combobox.highlightFirst()
        }
        break
      case 'End':
        if (openNow && list.length > 0 && !isEditableTarget(event)) {
          event.preventDefault()
          combobox.highlightLast()
        }
        break
      case 'PageUp':
        if (openNow && list.length > 0) {
          event.preventDefault()
          combobox.highlightFirst()
        }
        break
      case 'PageDown':
        if (openNow && list.length > 0) {
          event.preventDefault()
          combobox.highlightLast()
        }
        break
      case 'Enter':
        if (openNow && combobox.activeIndex.value >= 0 && list[combobox.activeIndex.value]) {
          event.preventDefault()
          selectHighlighted()
        }
        break
      case 'Escape':
        if (openNow) {
          event.preventDefault()
          close()
          options.onEscape?.()
        }
        break
      case 'Tab':
        if (openNow)
          close()
        break
    }
  }

  const activeId = computed(() => {
    if (!combobox.isOpen.value)
      return undefined
    return entries.value[combobox.activeIndex.value]?.id
  })

  return {
    query,
    combobox,
    entries,
    status: asyncSource.status,
    error: asyncSource.error,
    activeId,
    belowMinQueryLength,
    setQuery,
    open,
    close,
    onKeyDown,
  }
}

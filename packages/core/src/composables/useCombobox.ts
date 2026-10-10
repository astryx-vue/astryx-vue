import type { Ref } from 'vue'
import { computed, onScopeDispose, ref, watch } from 'vue'

export interface ComboboxOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface UseComboboxOptions<T = string | number> {
  /** 选项列表 */
  options: Ref<readonly ComboboxOption[]>
  /** 当前选中的值 */
  modelValue: Ref<T | null>
  /** 是否启用 */
  isEnabled?: Ref<boolean>
  /** 是否启用搜索过滤 */
  isSearchable?: Ref<boolean>
  /** 选中值变化回调 */
  onChange: (value: T | null) => void
  /** 打开/关闭状态变化回调 */
  onOpenChange?: (isOpen: boolean) => void
}

export interface Combobox<T = string | number> {
  /** 是否展开选项列表 */
  isOpen: Ref<boolean>
  /** 当前高亮的选项索引 */
  activeIndex: Ref<number>
  /** 搜索查询字符串 */
  searchQuery: Ref<string>
  /** 过滤后的选项列表 */
  filteredOptions: Ref<readonly ComboboxOption[]>
  /** 打开选项列表 */
  open: () => void
  /** 关闭选项列表 */
  close: () => void
  /** 切换展开状态 */
  toggle: () => void
  /** 选中某个选项 */
  select: (value: T | null) => void
  /** 高亮上一个选项 */
  highlightPrevious: () => void
  /** 高亮下一个选项 */
  highlightNext: () => void
  /** 高亮第一个选项 */
  highlightFirst: () => void
  /** 高亮最后一个选项 */
  highlightLast: () => void
  /** 选中当前高亮的选项 */
  selectHighlighted: () => void
  /** 更新搜索查询 */
  setSearchQuery: (query: string) => void
  /** 根据首字母跳转到选项 */
  jumpToMatch: (char: string) => void
  /** 处理键盘按键 */
  onKeyDown: (event: KeyboardEvent) => void
}

const TYPEAHEAD_RESET_MS = 750

/**
 * Combobox（组合框）交互逻辑：键盘导航、选择、搜索过滤、类型跳转。
 * 供 Selector、MultiSelector、Typeahead、CommandPalette 等组件复用。
 */
export function useCombobox<T = string | number>(
  options: UseComboboxOptions<T>,
): Combobox<T> {
  const {
    options: optionsList,
    modelValue,
    isEnabled = ref(true),
    isSearchable = ref(false),
    onChange,
    onOpenChange,
  } = options

  const isOpen = ref(false)
  const activeIndex = ref(-1)
  const searchQuery = ref('')
  let typeaheadBuffer = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  const filteredOptions = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query || !isSearchable.value) {
      return optionsList.value
    }
    return optionsList.value.filter((opt) => {
      return opt.label.toLowerCase().includes(query)
    })
  })

  const selectableOptions = computed(() => {
    return filteredOptions.value.filter(opt => !opt.disabled)
  })

  function open(): void {
    if (!isEnabled.value)
      return
    isOpen.value = true
    onOpenChange?.(true)
    // 打开时高亮当前选中项，如果没有选中则高亮第一项
    const currentValue = modelValue.value
    if (currentValue != null) {
      const index = filteredOptions.value.findIndex(opt => opt.value === currentValue)
      activeIndex.value = index >= 0 ? index : 0
    }
    else {
      activeIndex.value = 0
    }
  }

  function close(): void {
    isOpen.value = false
    onOpenChange?.(false)
    activeIndex.value = -1
    searchQuery.value = ''
  }

  function toggle(): void {
    if (isOpen.value) {
      close()
    }
    else {
      open()
    }
  }

  function select(value: T | null): void {
    onChange(value)
    close()
  }

  function highlightPrevious(): void {
    if (selectableOptions.value.length === 0)
      return

    let nextIndex = activeIndex.value - 1
    // 跳过禁用项
    while (nextIndex >= 0 && filteredOptions.value[nextIndex]?.disabled) {
      nextIndex--
    }
    if (nextIndex < 0) {
      // 循环到最后一项
      nextIndex = filteredOptions.value.length - 1
      while (nextIndex >= 0 && filteredOptions.value[nextIndex]?.disabled) {
        nextIndex--
      }
    }
    if (nextIndex >= 0) {
      activeIndex.value = nextIndex
    }
  }

  function highlightNext(): void {
    if (selectableOptions.value.length === 0)
      return

    let nextIndex = activeIndex.value + 1
    // 跳过禁用项
    while (nextIndex < filteredOptions.value.length && filteredOptions.value[nextIndex]?.disabled) {
      nextIndex++
    }
    if (nextIndex >= filteredOptions.value.length) {
      // 循环到第一项
      nextIndex = 0
      while (nextIndex < filteredOptions.value.length && filteredOptions.value[nextIndex]?.disabled) {
        nextIndex++
      }
    }
    if (nextIndex < filteredOptions.value.length) {
      activeIndex.value = nextIndex
    }
  }

  function highlightFirst(): void {
    if (selectableOptions.value.length === 0)
      return
    let index = 0
    while (index < filteredOptions.value.length && filteredOptions.value[index]?.disabled) {
      index++
    }
    if (index < filteredOptions.value.length) {
      activeIndex.value = index
    }
  }

  function highlightLast(): void {
    if (selectableOptions.value.length === 0)
      return
    let index = filteredOptions.value.length - 1
    while (index >= 0 && filteredOptions.value[index]?.disabled) {
      index--
    }
    if (index >= 0) {
      activeIndex.value = index
    }
  }

  function selectHighlighted(): void {
    const option = filteredOptions.value[activeIndex.value]
    if (option && !option.disabled) {
      select(option.value as T)
    }
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
    // 搜索时重置高亮到第一项
    if (query && filteredOptions.value.length > 0) {
      highlightFirst()
    }
  }

  function jumpToMatch(char: string): void {
    if (typeaheadTimer !== undefined) {
      clearTimeout(typeaheadTimer)
    }

    const lower = char.toLowerCase()
    const isRepeat = typeaheadBuffer.length > 0 && [...typeaheadBuffer].every(c => c === lower)
    typeaheadBuffer = isRepeat ? lower : typeaheadBuffer + lower

    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = ''
    }, TYPEAHEAD_RESET_MS)

    const options = filteredOptions.value
    const start = activeIndex.value >= 0 ? activeIndex.value : 0
    const offset = typeaheadBuffer.length === 1 ? 1 : 0

    for (let i = 0; i < options.length; i++) {
      const index = (start + offset + i) % options.length
      const option = options[index]
      if (option && !option.disabled && option.label.toLowerCase().startsWith(typeaheadBuffer)) {
        activeIndex.value = index
        break
      }
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!isEnabled.value)
      return

    // 如果是可搜索的，并且焦点在搜索框上，不拦截字母输入
    const target = event.target as HTMLElement
    const isSearchInput = isSearchable.value && target.tagName === 'INPUT'

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          open()
        }
        else {
          highlightNext()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen.value) {
          open()
        }
        else {
          highlightPrevious()
        }
        break
      case 'Home':
        if (!isSearchInput) {
          event.preventDefault()
          if (isOpen.value) {
            highlightFirst()
          }
        }
        break
      case 'End':
        if (!isSearchInput) {
          event.preventDefault()
          if (isOpen.value) {
            highlightLast()
          }
        }
        break
      case 'Enter':
        if (isOpen.value && activeIndex.value >= 0) {
          event.preventDefault()
          selectHighlighted()
        }
        break
      case 'Escape':
        if (isOpen.value) {
          event.preventDefault()
          close()
        }
        break
      case ' ':
        // 空格键：如果未打开则打开，已打开且不在搜索框则选中
        if (!isOpen.value) {
          event.preventDefault()
          open()
        }
        else if (!isSearchInput) {
          event.preventDefault()
          selectHighlighted()
        }
        break
      default:
        // 类型跳转：单字符且未按修饰键
        if (
          !isSearchInput
          && event.key.length === 1
          && !event.ctrlKey
          && !event.metaKey
          && !event.altKey
        ) {
          event.preventDefault()
          if (!isOpen.value) {
            open()
          }
          jumpToMatch(event.key)
        }
        break
    }
  }

  watch(modelValue, () => {
    // 当外部改变选中值时，更新高亮索引
    if (isOpen.value && modelValue.value != null) {
      const index = filteredOptions.value.findIndex(opt => opt.value === modelValue.value)
      if (index >= 0) {
        activeIndex.value = index
      }
    }
  })

  onScopeDispose(() => {
    if (typeaheadTimer !== undefined) {
      clearTimeout(typeaheadTimer)
    }
  })

  return {
    isOpen,
    activeIndex,
    searchQuery,
    filteredOptions,
    open,
    close,
    toggle,
    select,
    highlightPrevious,
    highlightNext,
    highlightFirst,
    highlightLast,
    selectHighlighted,
    setSearchQuery,
    jumpToMatch,
    onKeyDown,
  }
}

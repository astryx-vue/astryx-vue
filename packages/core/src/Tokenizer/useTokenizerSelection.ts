import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerMessages } from '../locale/messages/tokenizer.js'
import type { TypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import type { TypeaheadMenuConfigApi } from '../Typeahead/useTypeaheadMenuConfig.js'
import type { TokenizerChange } from './types.js'
import { nextTick } from 'vue'

export interface TokenizerSelectionOptions<T extends SearchableItem> {
  values: ComputedRef<readonly T[]>
  isDisabled: () => boolean
  atMax: ComputedRef<boolean>
  showsEntriesOnFocus: ComputedRef<boolean>
  menu: TypeaheadMenu<T>
  menuConfig: TypeaheadMenuConfigApi
  inputRef: Readonly<Ref<HTMLInputElement | null>>
  messages: () => TokenizerMessages
  announce: (message: string) => void
  /** 交出新的选择：`update:modelValue` 和 `change` 各一次。 */
  emitChange: (next: T[], change: TokenizerChange<T>) => void
}

export interface TokenizerSelection<T extends SearchableItem> {
  commit: (next: T[], change: TokenizerChange<T>) => void
  /** 从行内菜单选中一条或新建一条。 */
  add: (item: T, type: 'add' | 'create') => void
  /** 去掉一条并播报；字段禁用时什么都不做，返回 false。 */
  remove: (item: T) => boolean
  /** 行内字段的清除按钮：一次清掉全部并播报，收起菜单，焦点回到输入框。 */
  clearAll: (event?: Event) => void
}

/** Tokenizer 选择的增删：两种呈现共用提交和播报，行内菜单的焦点与清单去留也在这里。 */
export function useTokenizerSelection<T extends SearchableItem>(options: TokenizerSelectionOptions<T>): TokenizerSelection<T> {
  const { values, menu, menuConfig, inputRef } = options

  function commit(next: T[], change: TokenizerChange<T>): void {
    options.emitChange(next, change)
  }

  function add(item: T, type: 'add' | 'create'): void {
    if (options.isDisabled() || options.atMax.value || values.value.some(entry => entry.id === item.id))
      return
    // 从聚焦时展开的那张清单里选（还没输入过文字）：焦点和清单都留着，方便接着选下一个。
    const fromFocusList = options.showsEntriesOnFocus.value && type === 'add' && menu.query.value === ''
    const pickedIndex = Math.max(0, menu.entries.value.findIndex(entry => entry.item.id === item.id))
    menuConfig.beginPick()
    commit([...values.value, item], { type, item })
    options.announce(options.messages().added(item.label))
    menu.resetQuery()
    // 在 `change` 里调了 `open()` 的话，菜单跟着这次选择保持打开。
    if (!fromFocusList && !menuConfig.endPick())
      menu.close()
    void nextTick(() => {
      inputRef.value?.focus()
      if (!fromFocusList)
        return
      // 清单留着原来的行，只去掉刚选的：下一项变成高亮，选的是最后一项就落到前一项；
      // 没有可选项了、到了上限或字段被禁用就收起。
      const remaining = menu.entries.value
      if (remaining.length === 0 || options.atMax.value || options.isDisabled())
        menu.close()
      else
        menu.combobox.activeIndex.value = Math.min(pickedIndex, remaining.length - 1)
    })
  }

  function remove(item: T): boolean {
    if (options.isDisabled())
      return false
    commit(values.value.filter(entry => entry.id !== item.id), { type: 'remove', item })
    options.announce(options.messages().removed(item.label))
    return true
  }

  function clearAll(event?: Event): void {
    event?.stopPropagation()
    if (options.isDisabled() || values.value.length === 0)
      return
    commit([], { type: 'clear' })
    options.announce(options.messages().allRemoved)
    menu.close()
    inputRef.value?.focus()
  }

  return { commit, add, remove, clearAll }
}

import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { TypeaheadMenu } from './useTypeaheadMenu.js'
import { computed, toValue, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { searchResultMessage } from '../Selector/searchResultMessage.js'

export interface TypeaheadAnnouncementOptions {
  menu: Pick<TypeaheadMenu, 'combobox' | 'status' | 'query' | 'matchCount' | 'entries'>
  emptyText: MaybeRefOrGetter<string>
  emptySearchText: MaybeRefOrGetter<string>
  resultCount: (count: number) => string
}

/**
 * 输入了文字、搜索落定之后，念一句结果数（点名每一条匹配，包括超出 `maxMenuItems`
 * 没画出来的），或者没有结果的提示。加载中不念，因为还不知道有没有结果。
 */
export function useTypeaheadAnnouncement(options: TypeaheadAnnouncementOptions): ComputedRef<string> {
  const announce = useAnnounce()
  const { menu } = options
  const message = computed(() => {
    const createRows = menu.entries.value.filter(entry => entry.create).length
    return searchResultMessage({
      isOpen: menu.combobox.isOpen.value,
      isLoading: menu.status.value === 'loading',
      query: menu.query.value,
      matchCount: menu.matchCount.value,
      hasCreateRow: createRows > 0,
      emptyText: toValue(options.emptyText),
      emptySearchText: toValue(options.emptySearchText),
      resultCount: options.resultCount,
    })
  })
  watch(message, (next) => {
    if (next)
      announce(next)
  })
  return message
}

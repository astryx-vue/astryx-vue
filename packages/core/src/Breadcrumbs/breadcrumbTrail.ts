import type { ComputedRef } from 'vue'
import { computed, onMounted, ref } from 'vue'

interface TrailItem {
  id: string
  explicit: boolean | undefined
}

/**
 * 没人把某一项标成当前页时，最后一项就是当前页。
 * 明确写成 false 的项不参与。已经有人标了 true，就不再自动补。
 */
export function useBreadcrumbTrail(): {
  autoCurrentId: ComputedRef<string | null>
  registerItem: (id: string, explicit: boolean | undefined) => void
  updateItem: (id: string, explicit: boolean | undefined) => void
  unregisterItem: (id: string) => void
} {
  const items = ref<TrailItem[]>([])
  // 前面的项会先画出来。等这一轮子项都登记完再标自动当前页，避免每一项都先把自己当成当前页。
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })

  function registerItem(id: string, explicit: boolean | undefined): void {
    items.value = [...items.value.filter(item => item.id !== id), { id, explicit }]
  }

  function updateItem(id: string, explicit: boolean | undefined): void {
    items.value = items.value.map(item => item.id === id ? { id, explicit } : item)
  }

  function unregisterItem(id: string): void {
    items.value = items.value.filter(item => item.id !== id)
  }

  const autoCurrentId = computed(() => {
    if (!ready.value || items.value.some(item => item.explicit === true))
      return null
    const candidates = items.value.filter(item => item.explicit == null)
    return candidates.at(-1)?.id ?? null
  })

  return { autoCurrentId, registerItem, updateItem, unregisterItem }
}

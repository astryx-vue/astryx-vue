import type { ComputedRef } from 'vue'
import { computed, onUpdated, ref } from 'vue'

interface TrailItem {
  id: string
  explicit: boolean | undefined
  getElement: () => HTMLElement | null
}

function byDocumentOrder(a: TrailItem, b: TrailItem): number {
  const left = a.getElement()
  const right = b.getElement()
  if (left == null || right == null)
    return 0
  return left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/**
 * 没人把某一项标成当前页时，页面上排在最后的那一项就是当前页。
 * 最后一项明确写了 false，就谁都不是当前页，不往前顺延。已经有人标了 true，也不再自动补。
 * 项在挂载后才登记，所以服务端渲染时不会标自动当前页，和浏览器里第一帧一致。
 */
export function useBreadcrumbTrail(): {
  autoCurrentId: ComputedRef<string | null>
  registerItem: (id: string, explicit: boolean | undefined, getElement: () => HTMLElement | null) => void
  updateItem: (id: string, explicit: boolean | undefined) => void
  unregisterItem: (id: string) => void
} {
  const items = ref<TrailItem[]>([])
  // 子项换了顺序但没有增删时，靠这个数让顺序重新排一次。
  const order = ref(0)
  onUpdated(() => {
    order.value++
  })

  function registerItem(id: string, explicit: boolean | undefined, getElement: () => HTMLElement | null): void {
    items.value = [...items.value.filter(item => item.id !== id), { id, explicit, getElement }]
  }

  function updateItem(id: string, explicit: boolean | undefined): void {
    items.value = items.value.map(item => item.id === id ? { ...item, explicit } : item)
  }

  function unregisterItem(id: string): void {
    items.value = items.value.filter(item => item.id !== id)
  }

  const autoCurrentId = computed(() => {
    void order.value
    if (items.value.some(item => item.explicit === true))
      return null
    const last = [...items.value].sort(byDocumentOrder).at(-1)
    return last != null && last.explicit == null ? last.id : null
  })

  return { autoCurrentId, registerItem, updateItem, unregisterItem }
}

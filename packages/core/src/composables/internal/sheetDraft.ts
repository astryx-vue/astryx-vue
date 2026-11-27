/**
 * 触屏底部弹层的草稿规则（上游 internal/sheetDraft.ts）。
 *
 * 弹层编辑的是一份草稿，按「保存」才把整份草稿交出去，并附一条变化：还成立的最后
 * 一次编辑，否则找最近的一次净增或净减。草稿和打开时的选择按集合比较：取消勾选再
 * 勾回来不算改动，这时下滑、点遮罩、按 Escape 关闭都不用先确认。
 */

interface SheetDraftItem {
  id: string | number
}

/** 草稿的一次编辑，也是「保存」交出去的那条变化。 */
export interface SheetDraftChange<T> {
  item: T
  type: 'add' | 'create' | 'remove'
}

/** 两份选择是否是同一组条目，不看顺序。 */
export function hasSameSelection<T extends SheetDraftItem>(a: readonly T[], b: readonly T[]): boolean {
  if (a.length !== b.length)
    return false
  const ids = new Set(a.map(item => item.id))
  return b.every(item => ids.has(item.id))
}

/**
 * 草稿和打开时的选择不同时，「保存」要报的那条变化；没有不同时是 null。
 *
 * 最后一次编辑还成立（加的那项还在、打开时没有；删的那项打开时有、现在没了）就报它。
 * 否则：最后一次是删除并且确实少了某项，报那项的删除；再否则多了某项就报添加（最后
 * 一次正是新建它时报 `create`）；再否则报少了的那项。
 */
export function nameSheetDraftChange<T extends SheetDraftItem>(
  valueAtOpen: readonly T[],
  draftValue: readonly T[],
  lastDraftChange: SheetDraftChange<T> | null,
): SheetDraftChange<T> | null {
  const wasSelected = (id: T['id']): boolean => valueAtOpen.some(item => item.id === id)
  const isSelected = (id: T['id']): boolean => draftValue.some(item => item.id === id)
  const added = draftValue.find(item => !wasSelected(item.id))
  const removed = valueAtOpen.find(item => !isSelected(item.id))
  const lastChangeIsNet = lastDraftChange != null && (lastDraftChange.type === 'remove'
    ? wasSelected(lastDraftChange.item.id) && !isSelected(lastDraftChange.item.id)
    : isSelected(lastDraftChange.item.id) && !wasSelected(lastDraftChange.item.id))
  if (lastChangeIsNet)
    return lastDraftChange
  if (lastDraftChange?.type === 'remove' && removed != null)
    return { item: removed, type: 'remove' }
  if (added != null) {
    const type = lastDraftChange?.item.id === added.id && lastDraftChange.type === 'create' ? 'create' : 'add'
    return { item: added, type }
  }
  if (removed != null)
    return { item: removed, type: 'remove' }
  return null
}

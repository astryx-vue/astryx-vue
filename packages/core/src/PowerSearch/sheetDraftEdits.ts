import type { PowerSearchChangeType, PowerSearchFilter } from './types.js'
import { filterSignature } from './sheetFilterIdentity.js'

/** 草稿里的一次改动：改动前后的草稿、改动类型和它在草稿里的位置。点「完成」时按顺序重放到字段最新的条件上。 */
export interface DraftEdit {
  readonly before: readonly PowerSearchFilter[]
  readonly after: readonly PowerSearchFilter[]
  readonly changeType: PowerSearchChangeType
  readonly index: number
}

export type DraftReport = (filters: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number) => void

/** 两份条件列表按签名比，条件相同、顺序也相同。 */
export function hasSameFilters(a: readonly PowerSearchFilter[], b: readonly PowerSearchFilter[]): boolean {
  return a.length === b.length && a.every((filter, index) => b[index] != null && filterSignature(filter) === filterSignature(b[index]))
}

/** `before` 有而 `after` 没有的条件（按签名当多重集合比），保持 `before` 里的顺序。 */
export function removedFilters(before: readonly PowerSearchFilter[], after: readonly PowerSearchFilter[]): PowerSearchFilter[] {
  const remaining = new Map<string, number>()
  for (const filter of after) {
    const signature = filterSignature(filter)
    remaining.set(signature, (remaining.get(signature) ?? 0) + 1)
  }
  return before.filter((filter) => {
    const signature = filterSignature(filter)
    const count = remaining.get(signature) ?? 0
    if (count > 0) {
      remaining.set(signature, count - 1)
      return false
    }
    return true
  })
}

/**
 * 把草稿里的改动重放到 `base`（字段最新的条件）上，每一步都用改完的列表调一次 `report`。
 * 新增追加到末尾；修改替换第一个和原条件签名相同的条件；删除按签名去掉删掉的那些。
 * 修改或删除的目标已经不在 `base` 里（父组件在这期间删了它）时跳过。
 */
export function replayDraftEdits(base: readonly PowerSearchFilter[], edits: readonly DraftEdit[], report: DraftReport): PowerSearchFilter[] {
  let current = [...base]
  for (const edit of edits) {
    if (edit.changeType === 'add') {
      const added = edit.after[edit.index]
      if (added == null)
        continue
      current = [...current, added]
      report(current, 'add', current.length - 1)
    }
    else if (edit.changeType === 'edit') {
      const original = edit.before[edit.index]
      const updated = edit.after[edit.index]
      if (original == null || updated == null)
        continue
      const signature = filterSignature(original)
      const index = current.findIndex(filter => filterSignature(filter) === signature)
      if (index === -1)
        continue
      current = current.map((filter, i) => (i === index ? updated : filter))
      report(current, 'edit', index)
    }
    else {
      const indexes: number[] = []
      for (const signature of removedFilters(edit.before, edit.after).map(filterSignature)) {
        const index = current.findIndex((filter, i) => !indexes.includes(i) && filterSignature(filter) === signature)
        if (index !== -1)
          indexes.push(index)
      }
      if (indexes.length === 0)
        continue
      current = current.filter((_, i) => !indexes.includes(i))
      report(current, 'remove', Math.min(...indexes))
    }
  }
  return current
}

/** 行高相差在这个范围内，或者和声明的行高差这么多以内，算同一个行高。 */
export const PITCH_TOLERANCE = 0.75
/** 共同行高和声明值差得比这还小时，就是声明值。 */
export const PITCH_EPSILON = 0.01

/** 挂载行的检查结果：退回全部渲染的原因，或者所有行共同的新行高。 */
export type RowGeometryCheck = { reason: string } | { pitch: number } | undefined

function contentViolation(row: HTMLTableRowElement): string | undefined {
  for (const cell of Array.from(row.children) as HTMLElement[]) {
    if (cell.getAttribute('aria-hidden') === 'true')
      continue
    if (cell.clientHeight > 0 && cell.scrollHeight > cell.clientHeight + 1)
      return 'Mounted cell content exceeds the fixed row height.'
  }
  return undefined
}

function measureSharedPitch(rows: readonly HTMLTableRowElement[]): RowGeometryCheck {
  let min = Number.POSITIVE_INFINITY
  let max = 0
  let sum = 0
  let count = 0
  for (const row of rows) {
    const height = row.getBoundingClientRect().height
    if (!(height > 0))
      continue
    const reason = contentViolation(row)
    if (reason)
      return { reason }
    min = Math.min(min, height)
    max = Math.max(max, height)
    sum += height
    count += 1
  }
  if (count === 0)
    return undefined
  if (max - min > PITCH_TOLERANCE)
    return { reason: 'Mounted rows have different heights.' }
  return { pitch: sum / count }
}

/**
 * 只读挂载着的数据行。`checked` 里的行上次已经通过，内容变化时只读新挂上的行；
 * 有一行离开了行高，就把所有挂载行一起量：都一样高（例如放大了字号）就用这个新行高，否则退回。
 */
export function checkMountedRows(
  body: HTMLTableSectionElement,
  rowHeight: number,
  checked: WeakSet<HTMLTableRowElement>,
): RowGeometryCheck {
  if (!body.isConnected)
    return undefined
  const rows = Array.from(body.querySelectorAll<HTMLTableRowElement>(':scope > tr[data-window-row]'))
  for (const row of rows) {
    if (checked.has(row))
      continue
    const height = row.getBoundingClientRect().height
    if (height > 0 && Math.abs(height - rowHeight) > PITCH_TOLERANCE) {
      const shared = measureSharedPitch(rows)
      if (shared === undefined || 'reason' in shared || Math.abs(shared.pitch - rowHeight) > PITCH_TOLERANCE)
        return shared
    }
    const reason = contentViolation(row)
    if (reason)
      return { reason }
    if (height > 0)
      checked.add(row)
  }
  return undefined
}

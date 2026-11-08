export interface TimedEventInterval<Event extends { id: string }> {
  event: Event
  /** 从当天 0 点起的分钟，已经裁到可见窗口里。 */
  visibleStart: number
  visibleEnd: number
}

export interface TimedEventPlacement<Event extends { id: string }> {
  event: Event
  /** 相对可见分钟的纵向偏移，百分比。 */
  top: number
  /** 相对可见分钟的高度，百分比。 */
  height: number
  columnStart: number
  columnSpan: number
  columnCount: number
}

function compareIntervals<Event extends { id: string }>(
  a: TimedEventInterval<Event>,
  b: TimedEventInterval<Event>,
): number {
  if (a.visibleStart !== b.visibleStart)
    return a.visibleStart - b.visibleStart
  if (a.visibleEnd !== b.visibleEnd)
    return b.visibleEnd - a.visibleEnd
  return a.event.id < b.event.id ? -1 : a.event.id > b.event.id ? 1 : 0
}

function overlaps<Event extends { id: string }>(
  a: TimedEventInterval<Event>,
  b: TimedEventInterval<Event>,
): boolean {
  return a.visibleStart < b.visibleEnd && b.visibleStart < a.visibleEnd
}

/**
 * 直接相交或通过一串相交连在一起的事件属于同一簇。
 * 簇里每个事件占「上一个占用者已经结束」的第一列，再向后铺到自己这段时间没人占的列。
 * 顺序是开始时间、更长的在前、然后 `id`，和输入顺序无关。
 */
export function layoutTimedEvents<Event extends { id: string }>(
  intervals: ReadonlyArray<TimedEventInterval<Event>>,
  minMinute: number,
  maxMinute: number,
): TimedEventPlacement<Event>[] {
  const totalMinutes = Math.max(1, maxMinute - minMinute)
  const sorted = [...intervals].sort(compareIntervals)

  const clusters: TimedEventInterval<Event>[][] = []
  let clusterEnd = Number.NEGATIVE_INFINITY
  for (const interval of sorted) {
    const current = clusters[clusters.length - 1]
    if (current == null || interval.visibleStart >= clusterEnd) {
      clusters.push([interval])
      clusterEnd = interval.visibleEnd
    }
    else {
      current.push(interval)
      clusterEnd = Math.max(clusterEnd, interval.visibleEnd)
    }
  }

  const placements: TimedEventPlacement<Event>[] = []
  for (const cluster of clusters) {
    const columns: TimedEventInterval<Event>[][] = []
    const columnOf = new Map<TimedEventInterval<Event>, number>()
    for (const interval of cluster) {
      let column = columns.findIndex((occupants) => {
        const last = occupants[occupants.length - 1]
        return last.visibleEnd <= interval.visibleStart
      })
      if (column < 0) {
        column = columns.length
        columns.push([])
      }
      columns[column].push(interval)
      columnOf.set(interval, column)
    }

    for (const interval of cluster) {
      const columnStart = columnOf.get(interval) ?? 0
      let columnSpan = 1
      for (let next = columnStart + 1; next < columns.length; next += 1) {
        if (columns[next].some(occupant => overlaps(occupant, interval)))
          break
        columnSpan += 1
      }
      placements.push({
        event: interval.event,
        top: ((interval.visibleStart - minMinute) / totalMinutes) * 100,
        height: ((interval.visibleEnd - interval.visibleStart) / totalMinutes) * 100,
        columnStart,
        columnSpan,
        columnCount: columns.length,
      })
    }
  }

  return placements
}

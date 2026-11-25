/**
 * 一次输入发生在多久以前，按盖下这个时间戳的那个窗口的时钟算。
 *
 * 页面很忙时，监听函数会比触摸晚几十毫秒才跑。等待类的延时（比如滚动视图里按压的 150ms）
 * 要从触摸本身算起，不能从监听函数跑起来那一刻算，不然忙的页面会亮得更晚。
 */

type EventClock = Pick<Performance, 'now'>

/** 盖下时间戳的窗口的时钟：事件的 `view`，或者落点节点所在窗口。同源 iframe 的时钟起点比主页面晚。 */
function clockOf(source: unknown): EventClock | null {
  let view: unknown
  if (typeof Node !== 'undefined' && source instanceof Node)
    view = (source.ownerDocument ?? (source as Document)).defaultView
  else
    view = (source as { view?: unknown } | null | undefined)?.view
  return (view as { performance?: EventClock } | null | undefined)?.performance
    ?? (typeof performance === 'undefined' ? null : performance)
}

/**
 * 时间戳换算到窗口时钟上。jsdom 用 `Date.now()` 盖时间戳：离 `Date.now()` 比离窗口时钟更近的，
 * 就按它离 `Date.now()` 的距离算年龄，这样冻结的系统时间不会改变延时的长度。
 */
function timeOn(clock: EventClock | null, timeStamp: number | undefined): number | undefined {
  // 0 表示事件没带时间，延时就按完整长度算。
  if (timeStamp == null || !Number.isFinite(timeStamp) || timeStamp <= 0)
    return undefined
  if (clock != null && Math.abs(Date.now() - timeStamp) < Math.abs(clock.now() - timeStamp))
    return clock.now() - (Date.now() - timeStamp)
  return timeStamp
}

/** 盖着 `time` 的那次输入过去了多少毫秒。没有时间、或者时间在未来，都按刚刚发生算。 */
export function msSinceInput(time: number, source?: unknown): number {
  const clock = clockOf(source)
  const at = timeOn(clock, time)
  return clock == null || at == null ? 0 : Math.max(0, clock.now() - at)
}

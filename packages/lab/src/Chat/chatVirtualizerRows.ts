/**
 * ChatVirtualizer 这一次要挂哪些行：窗口里的行、拿着焦点但被窗口甩开的那一行、
 * 读者在翻历史时尾部新到的消息；以及哪些行算「新消息」、哪些算「历史」。纯函数。
 */
import type { RowWindow } from './chatVirtualizerTypes.js'

/** 内容块里的一项：一行，或者一段占位的空白。 */
export type RowEntry
  = | { kind: 'row', key: string, index: number }
    | { kind: 'gap', name: 'gapTop' | 'gapBottom' | 'gapTail' }

export interface DataChange {
  /** 这次变化在尾部追加、还没挂载过的行：只有它们按新消息挂载。 */
  news: Set<string>
  /** 第一行换了（往上加载了历史，或者裁掉了历史）。 */
  headChanged: boolean
}

/** 从末尾往前走到上一份数据里有的行为止，走过的就是追加到尾部的行。 */
function tailRun(previous: ReadonlySet<string> | ReadonlyMap<string, number>, keys: readonly string[]): { run: string[], isTailAppend: boolean } {
  const run: string[] = []
  for (let i = keys.length - 1; i >= 0; i--) {
    if (previous.has(keys[i]))
      return { run, isTailAppend: true }
    run.push(keys[i])
  }
  return { run, isTailAppend: false }
}

/**
 * 判断一次数据变化。只有尾部追加算新消息；装进空列表的整段会话或者换掉全部行的另一段会话
 * 都算历史，免得读屏把旧消息当新消息念。空列表里来的第一条消息例外，算新消息。
 */
export function classifyDataChange(previous: ReadonlyMap<string, number>, previousHead: string | undefined, keys: readonly string[]): DataChange {
  const { run, isTailAppend } = tailRun(previous, keys)
  const isFirstMessage = previous.size === 0 && run.length === 1
  const head = keys[0]
  return {
    news: isTailAppend || isFirstMessage ? new Set(run) : new Set(),
    headChanged: head !== undefined && previousHead !== undefined && head !== previousHead,
  }
}

function hasWindow(win: RowWindow): boolean {
  return win.end >= win.start
}

/**
 * 读者在翻历史时尾部新到、窗口还没够到的消息。它们挂在窗口下方一段空白之后，
 * 读屏照常能念到。窗口够到它、或者它从数据里消失时离开；最多留一个窗口那么多条最新的。
 */
export function nextArrivals(
  previousKeys: readonly string[] | null,
  keys: readonly string[],
  win: RowWindow,
  arrived: ReadonlySet<string>,
): Set<string> {
  const indexOf = new Map<string, number>()
  keys.forEach((key, i) => indexOf.set(key, i))
  const reached = (key: string): boolean => hasWindow(win) && (indexOf.get(key) ?? -1) <= win.end
  const next = new Set<string>()
  for (const key of arrived) {
    if (indexOf.has(key) && !reached(key))
      next.add(key)
  }
  if (previousKeys !== null) {
    const { run, isTailAppend } = tailRun(new Set(previousKeys), keys)
    // 窗口已经够到上一份数据最后一行时，追加由窗口自己跟上。
    const wasAtTail = hasWindow(win) && win.end >= previousKeys.length - 1
    if (isTailAppend && !wasAtTail) {
      for (const key of run) {
        if (!reached(key))
          next.add(key)
      }
    }
  }
  const room = Math.max(1, win.end - win.start + 1)
  if (next.size <= room)
    return next
  const newest = [...next].sort((a, b) => (indexOf.get(b) ?? -1) - (indexOf.get(a) ?? -1)).slice(0, room)
  return new Set(newest)
}

export interface RowPlan {
  entries: RowEntry[]
  /** 窗口外仍挂着的焦点行。 */
  pinnedKey: string | null
  /** 尾部新到的那一段的第一行。 */
  tailKey: string | null
}

/** 按窗口、焦点行和尾部新到的行排出内容块里的顺序。焦点行在兄弟节点里的相对位置不变，节点不会被挪走丢掉焦点。 */
export function planRows(keys: readonly string[], win: RowWindow, focusedKey: string | null, arrived: ReadonlySet<string>): RowPlan {
  const entries: RowEntry[] = []
  if (!hasWindow(win) || keys.length === 0)
    return { entries, pinnedKey: null, tailKey: null }
  const end = Math.min(win.end, keys.length - 1)
  let pinned = focusedKey === null ? -1 : keys.indexOf(focusedKey)
  if (pinned >= win.start && pinned <= end)
    pinned = -1
  let tail = -1
  if (arrived.size > 0) {
    for (let i = keys.length - 1; i > end; i--) {
      if (arrived.has(keys[i]))
        tail = i
    }
  }
  // 落在尾部那一段里的焦点行由那一段画。
  if (tail >= 0 && pinned >= tail)
    pinned = -1
  const row = (i: number): RowEntry => ({ kind: 'row', key: keys[i], index: i })
  if (pinned >= 0 && pinned < win.start)
    entries.push(row(pinned), { kind: 'gap', name: 'gapTop' })
  for (let i = win.start; i <= end; i++)
    entries.push(row(i))
  if (pinned > end)
    entries.push({ kind: 'gap', name: 'gapBottom' }, row(pinned))
  if (tail >= 0) {
    entries.push({ kind: 'gap', name: pinned > end ? 'gapTail' : 'gapBottom' })
    for (let i = tail; i < keys.length; i++)
      entries.push(row(i))
  }
  return {
    entries,
    pinnedKey: pinned < 0 ? null : keys[pinned],
    tailKey: tail < 0 ? null : keys[tail],
  }
}

/** 这次挂上的行里有没有不是新消息的（窗口移到历史上，或者上方加载了历史）。 */
export function mountsHistory(rendered: readonly string[], committed: ReadonlySet<string>, news: ReadonlySet<string>): boolean {
  return rendered.some(key => !committed.has(key) && !news.has(key))
}

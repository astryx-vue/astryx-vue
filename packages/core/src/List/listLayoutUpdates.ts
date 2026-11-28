/**
 * @file listLayoutUpdates.ts
 * @input List 的元素、它的 `animatedLayout` 句柄和 motion/layout 的布局动效模块
 * @output `useListLayoutUpdates`：两次渲染之间插入、移除、移动的每一行都报告给句柄
 * @position List 内部，List 把自己的 `animatedLayout` 传进来
 *
 * - 模块只给量过的行播退场，所以可见区域里的每一行都报告。最后一行也报告，
 *   没有行在可见区域时列表后面的内容照样滑。
 * - 模块只读可见区域上下一段范围里的行，长列表远处的行从不读。
 * - 两行交叉时，滑得更远的那行从上方经过，背后垫着列表的表面，像 UIKit 不透明的 cell 从邻居上方经过。
 * - 没有 `itemKey` 的行没有身份，它自己的变化直接落地；带键的行变化把它挤动时它照样滑。
 * - 横滑在 Vue 版移动的是行里的表面，不是行自己，行的盒子一直在列表里的位置上，
 *   离开的行直接在自己的盒子上退场。
 */
import type { AnimatedLayout, LayoutChange } from '../motion/layout/index.js'
import { onBeforeUpdate, onUpdated } from 'vue'
import { holdLayoutExit, playLayoutChange, reportLayoutChange } from '../motion/layout/index.js'
import { setReportedRows, showAsItLeft } from './listPresentation.js'
import { isLeaving, itemKeyOf, markLeaving, markTravelling } from './listRowMarks.js'
import { keyedRows, placeBefore, rowSequence, rowsMeeting } from './listRows.js'

/** 不到半像素的移动是排版误差，不算变化。 */
const MIN_MOVE_PX = 0.5

/** 更新前量到的东西，留给同一次更新 DOM 变化之后用。 */
interface Measured {
  /** 每个带键的行，按键、按顺序。 */
  readonly rows: ReadonlyMap<string, HTMLElement>
  readonly order: ReadonlyArray<string>
  /** 可见区域附近的行（`order` 里从 `near[0]` 到 `near[1]`）原来的顶边：只有它们会在可见区域里滑。 */
  readonly tops: ReadonlyMap<string, number>
  readonly near: readonly [number, number] | null
  /** 报告给模块的行，只有它们的退场会被接住。 */
  readonly reported: ReadonlySet<HTMLElement>
  readonly changes: ReadonlyArray<LayoutChange>
  /** 更新前列表里带键的行和还在退场的行，按顺序。 */
  readonly sequence: ReadonlyArray<HTMLElement>
}

function viewportHeight(list: HTMLElement): number {
  return list.ownerDocument.defaultView?.innerHeight ?? 0
}

function report(handle: AnimatedLayout, target: HTMLElement): LayoutChange {
  const change = reportLayoutChange(handle, () => target)
  change.measureBefore()
  return change
}

/** DOM 变化之前：量可见区域附近的行，把要报告的行交给模块。只读不写。 */
function measure(list: HTMLElement, handle: AnimatedLayout): Measured {
  const rows = keyedRows(list)
  if (rows.size === 0) {
    // 还没有带键的行：用列表最后一个子元素，列表空着时用列表自己顶替。
    // 第一个带键的行随后入场，列表后面的内容滑开。
    const last = list.lastElementChild
    const target = last instanceof HTMLElement ? last : list
    return {
      rows,
      order: [],
      tops: new Map(),
      near: null,
      reported: new Set([target]),
      changes: [report(handle, target)],
      sequence: rowSequence(list),
    }
  }
  const order = [...rows.keys()]
  const elements = [...rows.values()]
  const height = viewportHeight(list)
  // 可见区域上下各一屏高的范围里的行才可能在可见区域里滑，只读它们的位置。
  const near = rowsMeeting(elements, -height, 2 * height)
  const tops = new Map<string, number>()
  if (near != null) {
    for (let index = near[0]; index <= near[1]; index++)
      tops.set(order[index]!, elements[index]!.getBoundingClientRect().top)
  }
  const shown = rowsMeeting(elements, 0, height)
  const targets: HTMLElement[] = []
  if (shown != null) {
    for (let index = shown[0]; index <= shown[1]; index++)
      targets.push(elements[index]!)
  }
  if (shown == null || shown[1] !== elements.length - 1)
    targets.push(elements.at(-1)!)
  return {
    rows,
    order,
    tops,
    near,
    reported: new Set(targets),
    changes: targets.map(target => report(handle, target)),
    sequence: rowSequence(list),
  }
}

/**
 * 交叉的两行里，滑得更远的那行在滑动期间标成「滑过」，从上方经过。
 * 等模块自己的微任务读完排版、开始滑动后再标：先标会让模块再排一次版。
 * 顺着、倒着各扫一遍可见区域附近的行，找出和别的行交叉的行，只在它们之间比较。
 */
function markCrossings(measured: Measured, now: ReadonlyMap<string, HTMLElement>): void {
  const { near, order, tops } = measured
  if (near == null)
    return
  const rows: { element: HTMLElement, from: number, to: number }[] = []
  for (let index = near[0]; index <= near[1]; index++) {
    const key = order[index]!
    const from = tops.get(key)
    const element = now.get(key)
    if (from != null && element != null)
      rows.push({ element, from, to: element.getBoundingClientRect().top })
  }
  // 前面的行落到它下面，或后面的行落到它上面，这一行就和别的行交叉了。
  const crosses = rows.map(() => false)
  let lowest = -Infinity
  rows.forEach((row, index) => {
    crosses[index] = lowest > row.to
    lowest = Math.max(lowest, row.to)
  })
  let highest = Infinity
  for (let index = rows.length - 1; index >= 0; index--) {
    crosses[index] ||= highest < rows[index]!.to
    highest = Math.min(highest, rows[index]!.to)
  }
  const crossing = rows.filter((_, index) => crosses[index])
  const raised = new Set<HTMLElement>()
  const travel = (row: { from: number, to: number }): number => Math.abs(row.to - row.from)
  for (let a = 0; a < crossing.length; a++) {
    for (let b = a + 1; b < crossing.length; b++) {
      const upper = crossing[a]!
      const lower = crossing[b]!
      if (upper.to <= lower.to)
        continue
      // 一样远时往上滑的那行在上面。
      const rider = travel(upper) > travel(lower) ? upper : lower
      if (travel(rider) >= MIN_MOVE_PX)
        raised.add(rider.element)
    }
  }
  if (raised.size === 0)
    return
  queueMicrotask(() => {
    for (const element of raised) {
      const glide = typeof element.getAnimations === 'function' ? element.getAnimations().at(-1) : undefined
      if (glide != null) {
        const end = markTravelling(element)
        glide.finished.then(end, end)
      }
    }
  })
}

/** DOM 变化之后：离开的行放回原处播退场，量过的变化开始滑，新出现在可见区域的行入场。 */
function play(list: HTMLElement, handle: AnimatedLayout, measured: Measured): void {
  const now = keyedRows(list)
  const order = [...now.keys()]
  // 同样的行、同样的顺序：没什么可播（量到的变化下一帧自己作废）。
  if (order.length === measured.order.length && order.every((key, index) => key === measured.order[index]))
    return
  // 离开的行和还在退场的行都留在原位：前面有几行留下的行，它就排在几行之后。
  // Vue 只挪自己的行，所以周围的行移动时，退场行也靠这一步留在原位。
  const current = [...now.values()]
  const staying = new Set(current)
  const places = new Map<HTMLElement | null, HTMLElement[]>()
  const leaving: HTMLElement[] = []
  let before = 0
  for (const element of measured.sequence) {
    if (staying.has(element)) {
      before += 1
      continue
    }
    if (!isLeaving(element)) {
      // 只有模块量过的行能播退场；其余的（在可见区域外）随这次更新直接走。
      if (!measured.reported.has(element))
        continue
      markLeaving(element)
      // 退场时会变 inert；在那之前先对读屏隐藏，之后的更新也不再把它当作行。
      element.setAttribute('aria-hidden', 'true')
      leaving.push(element)
    }
    const anchor = current[before] ?? null
    places.set(anchor, [...(places.get(anchor) ?? []), element])
  }
  for (const [anchor, rows] of places)
    placeBefore(list, rows, anchor)
  for (const element of leaving)
    showAsItLeft(element)
  for (const change of measured.changes)
    change.animate()
  for (const element of leaving) {
    // 模块不接的退场（在可见区域外、减少动态效果配精确指针）：这一帧画出来之前就移除。
    if (!holdLayoutExit(handle, element, () => element.remove()))
      element.remove()
  }
  // 出现在可见区域里的新行入场（模块只在可见区域里播入场）。
  const shown = rowsMeeting(current, 0, viewportHeight(list))
  if (shown != null) {
    for (let index = shown[0]; index <= shown[1]; index++) {
      const element = current[index]!
      const key = itemKeyOf(element)
      if (key != null && !measured.rows.has(key))
        playLayoutChange(handle, element)
    }
  }
  markCrossings(measured, now)
}

/**
 * 把列表行的变化报告给 `animatedLayout`：列表每次重新渲染、DOM 变化之前量，变化之后播。
 * 没有句柄时什么都不做。
 */
export function useListLayoutUpdates(
  list: () => HTMLElement | null,
  animatedLayout: () => AnimatedLayout | null | undefined,
  skips: () => boolean = () => false,
): void {
  let measured: Measured | null = null

  onBeforeUpdate(() => {
    measured = null
    const element = list()
    const handle = animatedLayout()
    // 拖动重排或重排模式的一步拥有这次提交，行的滑动由重排自己来做。
    if (element == null || handle == null || skips())
      return
    measured = measure(element, handle)
    // 卸载的行在离开文档前读这张表，决定要不要记下自己离开时的样子。
    setReportedRows(element, measured.reported)
  })

  onUpdated(() => {
    const pending = measured
    measured = null
    const element = list()
    if (element != null)
      setReportedRows(element, null)
    const handle = animatedLayout()
    if (pending == null || element == null || handle == null)
      return
    play(element, handle, pending)
  })
}

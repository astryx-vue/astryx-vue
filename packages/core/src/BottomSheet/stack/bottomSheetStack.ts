import type { BottomSheetReplaceMotion, BottomSheetStackRegistration, BottomSheetStackView, ClosingGroup, Entry, Rank } from './stackState.js'
import { returnFocusTo } from './sheetHost.js'
import { applyMotionReport, detectReplace, flushPendingDrops, focusPendingReplacer } from './stackReplace.js'
import {
  BOTTOM_SHEET_STACK_DEFAULT_VIEW,
  findEntry,
  getShownOrder,
  groupOf,
  listenForPresses,
  recordFlip,
  resetStackState,
  scheduleSeal,
  setShownOrder,
  sortedEntries,
  state,
  stopListeningForPresses,
} from './stackState.js'
import { computeViews, reconcileTopLayer } from './stackViews.js'

/**
 * 底部面板叠放登记表的入口。宿主只在 post 回调（DOM 已更新、浏览器还没绘制）里调它。
 *
 * 顺序就是打开顺序。每次打开拿一个名次：先比批次（一次 Vue 更新），同一批再比树序，所以外面的
 * 面板排在它内容里的面板下面。顶层不靠信任，而是对账：已呈现顺序和名次不一致时，从第一处不同开始
 * 往上关掉，再按名次重新呈现，都在绘制之前完成。
 *
 * 替换是同一次更新里一张关、一张开，关掉的是最上面那张，而且最后的按压或焦点在它里面。登记表就在这两个
 * 对话框上跑切换器那套交接。被盖住的面板关掉、在另一次更新里关、或者从关掉那张外面驱动的变化，都不是替换。
 * 非模态面板之间也会替换，但从不叠放。
 */

export type { BottomSheetReplaceable, BottomSheetReplaceMotion, BottomSheetStackRegistration, BottomSheetStackView } from './stackState.js'
export { BOTTOM_SHEET_STACK_DEFAULT_VIEW } from './stackState.js'

function takeRank(): Rank {
  state.isBatchDirty = true
  scheduleSeal(sealBottomSheetBatch)
  return { batch: state.currentBatch, seq: state.nextSeq++ }
}

/** 结束当前这一批。之后的登记就是另一个打开顺序了。 */
export function sealBottomSheetBatch(): void {
  flushPendingDrops()
  sealClosingGroups()
  if (state.isBatchDirty) {
    state.currentBatch += 1
    state.isBatchDirty = false
  }
  state.batchOpened = []
  state.batchClosed = []
  state.batchActor = null
  state.batchPair = null
}

/**
 * 同一叠里两张以上模态面板在同一次更新里一起关、这叠里没有剩下打开的、也没有新开的：「全部关闭」。
 * 每张自己还焦点都还不成：打开者要么在一起关的对话框里，要么在仍被别的模态挡着的页面上。
 * 这一组在最后一个对话框离开顶层后，按最底下那张的归还目标还一次焦点。
 */
function sealClosingGroups(): void {
  if (state.batchOpened.length > 0)
    return
  const closingModal = state.batchClosed.filter(entry => entry.isModal && entry.replace == null && entry.replacing == null)
  if (closingModal.length < 2)
    return
  const byDoc = new Map<Document, Entry[]>()
  for (const entry of closingModal)
    byDoc.set(entry.doc, [...(byDoc.get(entry.doc) ?? []), entry])
  for (const [doc, closing] of byDoc) {
    if (closing.length < 2)
      continue
    const stack = sortedEntries(doc, true)
    if (stack.some(entry => entry.isOpen))
      continue
    const members = stack.filter(entry => closing.includes(entry))
    const group: ClosingGroup = {
      members,
      pending: new Set(members),
      returnTarget: members[0].getReturnTarget?.() ?? null,
    }
    for (const entry of members)
      state.closingTogether.set(entry, group)
  }
}

/** `key` 是否作为「全部关闭」的一员在关：它的宿主离开顶层时不自己还焦点。 */
export function isClosingTogether(key: object): boolean {
  const entry = findEntry(key)
  return entry != null && state.closingTogether.has(entry)
}

function leaveClosingGroup(entry: Entry, group: ClosingGroup): void {
  state.closingTogether.delete(entry)
  group.pending.delete(entry)
  if (group.pending.size > 0 || group.reported)
    return
  group.reported = true
  returnFocusTo(group.returnTarget)
}

/** 「全部关闭」的一员离开了顶层；最后一个离开时焦点回到这一组的归还目标。 */
export function reportClosedTogether(key: object): void {
  const entry = findEntry(key)
  const group = entry == null ? undefined : state.closingTogether.get(entry)
  if (entry != null && group != null)
    leaveClosingGroup(entry, group)
}

function update(doc: Document, isModal: boolean): void {
  detectReplace()
  // 一批的开和关都到了，配对就定了：还挂着 replace 的是替换者已经离开流程的被替换面板。
  if (state.batchOpened.length > 0 && state.batchClosed.length > 0)
    flushPendingDrops()
  const order = sortedEntries(doc, isModal)
  computeViews(order, isModal)
  reconcileTopLayer(doc, isModal, order)
  state.focusToKeep.delete(doc)
  focusPendingReplacer()
}

function rankFor(key: object, isOpen: boolean): Rank {
  const remembered = state.rankByKey.get(key)
  // 卸载又在同一批里重新登记（同一次更新里换了宿主）时沿用名次，不会因此被抬上去。
  if (remembered != null && !remembered.isClosed && (remembered.detachedBatch == null || remembered.detachedBatch === state.currentBatch)) {
    remembered.detachedBatch = null
    return { batch: remembered.batch, seq: remembered.seq }
  }
  const rank = takeRank()
  state.rankByKey.set(key, { ...rank, isClosed: !isOpen, detachedBatch: null })
  return rank
}

/**
 * 面板呈现期间加入叠放，返回离开的函数。`isOpen` 是受控的打开状态；呈现着但 `isOpen` 为假的
 * 面板正在滑出，保留位置但不算一层。
 */
export function registerBottomSheet(registration: BottomSheetStackRegistration, isOpen: boolean, isModal = true): () => void {
  const { key } = registration
  const rank = rankFor(key, isOpen)
  const doc = registration.getElement()?.ownerDocument ?? document
  listenForPresses(doc)
  const entry: Entry = {
    ...registration,
    rank,
    isOpen,
    doc,
    isModal,
    view: BOTTOM_SHEET_STACK_DEFAULT_VIEW,
    replace: null,
    replacing: null,
    isEnteringInPlace: false,
  }
  state.entries.push(entry)
  if (isOpen && rank.batch === state.currentBatch && state.isBatchDirty)
    recordFlip(entry, 'opened')
  update(doc, isModal)
  return () => leave(entry)
}

function leave(entry: Entry): void {
  const index = state.entries.indexOf(entry)
  if (index === -1)
    return
  state.entries.splice(index, 1)
  stopListeningForPresses(entry.doc)
  setShownOrder(entry.doc, entry.isModal, getShownOrder(entry.doc, entry.isModal).filter(shown => shown !== entry))
  state.batchOpened = state.batchOpened.filter(other => other !== entry)
  state.batchClosed = state.batchClosed.filter(other => other !== entry)
  state.pendingDrops = state.pendingDrops.filter(other => other !== entry)
  if (state.pendingReplaceFocus === entry)
    state.pendingReplaceFocus = null
  if (state.batchPair?.replaced === entry || state.batchPair?.replacer === entry)
    state.batchPair = null
  // 「全部关闭」的一员离开登记表就是走完了：退场途中被卸载的宿主不会再报动作。
  const closingGroup = state.closingTogether.get(entry)
  if (entry.replace != null) {
    entry.replace.replacer.replacing = null
    entry.replace = null
  }
  if (entry.replacing != null) {
    // 它正在替换的那张变回普通的关闭。
    entry.replacing.replace = null
    entry.replacing = null
  }
  // 对话框还开着就离开（被卸载）：没有盒子的模态对话框会一直挡着页面，在这里离开顶层。
  entry.hide()
  if (closingGroup != null)
    leaveClosingGroup(entry, closingGroup)
  const current = state.rankByKey.get(entry.key)
  if (current != null) {
    current.detachedBatch = state.currentBatch
    state.isBatchDirty = true
    scheduleSeal(sealBottomSheetBatch)
  }
  entry.view = BOTTOM_SHEET_STACK_DEFAULT_VIEW
  entry.onView(entry.view)
  update(entry.doc, entry.isModal)
}

/**
 * 这一层换了实现它的对话框：切换器交接到一个自带对话框的步骤，宿主在同一次更新里把它呈现到了顶层最上面。
 * 这一层保留名次；登记表把新对话框记为最近呈现的，再把该在它上面的面板放回上面。
 */
export function notifyBottomSheetHostChanged(key: object): void {
  const entry = findEntry(key)
  if (entry == null || !entry.isModal)
    return
  const element = entry.getElement()
  if (element == null || !element.open)
    return
  const shown = getShownOrder(entry.doc, true).filter(shownEntry => shownEntry !== entry)
  shown.push(entry)
  setShownOrder(entry.doc, true, shown)
  update(entry.doc, true)
}

/** 报告已登记面板的受控打开状态。关闭时滑出期间保留位置；重新打开拿新名次，回到最上面。 */
export function setBottomSheetOpen(key: object, isOpen: boolean): void {
  const entry = findEntry(key)
  if (entry == null || entry.isOpen === isOpen)
    return
  entry.isOpen = isOpen
  if (isOpen) {
    const group = state.closingTogether.get(entry)
    if (group != null) {
      state.closingTogether.delete(entry)
      group.pending.delete(entry)
    }
    entry.rank = takeRank()
    state.rankByKey.set(key, { ...entry.rank, isClosed: false, detachedBatch: null })
    recordFlip(entry, 'opened')
    // 被替换途中又打开：它又是一张面板了，不再淡出。
    if (entry.replace != null) {
      entry.replace.replacer.replacing = null
      entry.replace = null
      entry.isEnteringInPlace = true
    }
  }
  else {
    const remembered = state.rankByKey.get(key)
    if (remembered != null)
      remembered.isClosed = true
    state.isBatchDirty = true
    scheduleSeal(sealBottomSheetBatch)
    recordFlip(entry, 'closed')
    entry.isEnteringInPlace = false
    // 正在替换别人的面板关了，就丢掉它正在替换的那张，除非那张就是这次更新里回来的（往回走），
    // 那会被配成反方向的替换。本批其它翻转可能还没到，所以等配对定下来再丢。
    if (entry.replacing != null)
      state.pendingDrops.push(entry.replacing)
  }
  update(entry.doc, entry.isModal)
}

/** 面板的动作开始和结束都报到这里；替换期间由它推进交接。 */
export function reportBottomSheetMotion(key: object, event: 'start' | 'complete', motion: BottomSheetReplaceMotion): void {
  const entry = findEntry(key)
  if (entry != null && applyMotionReport(entry, event, motion))
    update(entry.doc, entry.isModal)
}

/** `key` 正下方那张打开的面板：它的对话框和把焦点送进去的办法。下面没有打开的就是 `null`。 */
export function getBottomSheetBeneath(key: object): { element: HTMLDialogElement, focus: () => void } | null {
  const own = findEntry(key)
  if (own == null)
    return null
  const order = groupOf(own)
  for (let below = order.indexOf(own) - 1; below >= 0; below -= 1) {
    const entry = order[below]
    const element = entry.getElement()
    if (entry.isOpen && element != null)
      return { element, focus: () => entry.focus('reveal') }
  }
  return null
}

/** 只给测试用：已呈现的面板对话框，从下到上，带各自的视图。 */
export function getBottomSheetStackForTests(doc: Document = document, isModal = true): ReadonlyArray<{
  element: HTMLDialogElement | null
  isOpen: boolean
  view: BottomSheetStackView
}> {
  return sortedEntries(doc, isModal).map(entry => ({ element: entry.getElement(), isOpen: entry.isOpen, view: entry.view }))
}

/** 只给测试用：忘掉所有面板，批次从头数。 */
export function resetBottomSheetStackForTests(): void {
  for (const entry of state.entries) {
    const remove = state.listenedDocuments.get(entry.doc)
    if (remove != null) {
      state.listenedDocuments.delete(entry.doc)
      remove()
    }
  }
  resetStackState()
}

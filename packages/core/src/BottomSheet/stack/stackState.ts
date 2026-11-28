/**
 * 底部面板叠放登记表的类型和共享状态。
 *
 * 每张模态面板各有自己的原生 `<dialog>` 和打开状态。浏览器只知道后 `showModal()` 的对话框
 * 盖在先打开的上面，不知道它们是同一叠面板。这张登记表决定谁在最上面、被盖住的往后退多少、
 * 谁的 `::backdrop` 是唯一那层遮罩。
 *
 * 状态挂在 `globalThis` 上、键名带协议版本：同一页面里装了两份包（两个打包产物、微前端）
 * 也共用一叠；版本不同的那份各管各的。每个 document 自成一叠。
 */

import type { BottomSheetFocusReason } from '../focusSheetPanel.js'

export type { BottomSheetFocusReason }

export type BottomSheetReplacedMotion = 'covered' | 'aligning' | 'fading'

/** 面板在叠放里的位置，由登记表算出来交给宿主。 */
export interface BottomSheetStackView {
  /** 同时还有别的模态面板在呈现。 */
  readonly isStacked: boolean
  /** 打开着、而且在最上面。 */
  readonly isTop: boolean
  /** 打开着，上面还压着别的打开的面板。 */
  readonly isCovered: boolean
  /** 上面压着几张打开的面板；决定往后退多少。 */
  readonly depth: number
  /** 这一层的 `::backdrop` 就是这叠唯一可见的遮罩。 */
  readonly ownsScrim: boolean
  /** 从下面一张还在滑出的面板手里接过遮罩：自己的遮罩要立刻出现，不能再淡入。 */
  readonly isScrimHandoff: boolean
  /** 被盖住、里面也没有正在呈现的面板：整个对话框可以 inert 并对读屏隐藏。 */
  readonly isBlocked: boolean
  /** 正在关闭，遮罩已经交给上面一张打开的面板：自己的遮罩要立刻撤掉，不能淡出叠两层。 */
  readonly isScrimTakenOver: boolean
  /** 正被同一次更新里打开的面板替换：原地留着、向下对齐、或淡出，而不是滑出去。 */
  readonly replacedMotion: BottomSheetReplacedMotion | null
  /** 被替换的面板向下移多少像素去对齐新面板的顶边。 */
  readonly alignmentOffset: number
  /** 正在替换同一次更新里关掉的那张。 */
  readonly isReplacing: boolean
}

export const BOTTOM_SHEET_STACK_DEFAULT_VIEW: BottomSheetStackView = Object.freeze({
  isStacked: false,
  isTop: false,
  isCovered: false,
  depth: 0,
  ownsScrim: false,
  isScrimHandoff: false,
  isBlocked: false,
  isScrimTakenOver: false,
  replacedMotion: null,
  alignmentOffset: 0,
  isReplacing: false,
})

/** 替换交接时面板向登记表报告的动作。 */
export type BottomSheetReplaceMotion = 'entering' | 'aligning' | 'fading' | 'exiting'

/** 宿主参加替换交接要提供的东西。没有它的宿主（切换器流程自己管步骤）不参与配对。 */
export interface BottomSheetReplaceable {
  /** 可见面板，量对齐距离用。 */
  getPanel: () => HTMLElement | null
  /** 关掉整段流程时焦点回到哪里。 */
  getOpener: () => HTMLElement | null
  /** 接过被替换那张的打开者，流程关掉时回到最初的地方。 */
  setOpener: (opener: HTMLElement | null) => void
  /** 交接结束：被替换的面板已经藏起、对话框已关。 */
  finish: () => void
}

export interface BottomSheetStackRegistration {
  /** 宿主实例的稳定身份。 */
  key: object
  /** 宿主的原生对话框。 */
  getElement: () => HTMLDialogElement | null
  /** 同一次更新里按树序排它时用的元素；不给就用对话框本身。 */
  getTreeAnchor?: () => Element | null
  /** 呈现对话框（模态用 `showModal()`），呈现前先记下打开者。 */
  show: () => void
  /** 把对话框移出顶层（`close()`），用于重排或收尾。 */
  hide: () => void
  /** 把焦点送进面板。 */
  focus: (reason: BottomSheetFocusReason) => void
  /** 这张关掉整叠时焦点回到哪里：明确的 finalFocusRef，否则打开者。 */
  getReturnTarget?: () => HTMLElement | null
  /** 位置变了就收到新的视图。 */
  onView: (view: BottomSheetStackView) => void
  replaceable?: BottomSheetReplaceable
}

export interface Rank {
  batch: number
  seq: number
}

export interface ReplaceState {
  /** 同一次更新里打开、接替这一张的面板。 */
  replacer: Entry
  motion: BottomSheetReplacedMotion
  alignmentOffset: number
  isAlignmentComplete: boolean
  isEnteringComplete: boolean
}

export interface Entry extends BottomSheetStackRegistration {
  rank: Rank
  isOpen: boolean
  doc: Document
  /** 模态面板互相叠放；非模态的自成一组：不叠、不退、没有遮罩，只互相替换。 */
  isModal: boolean
  view: BottomSheetStackView
  /** 被替换期间设在已关闭的面板上。 */
  replace: ReplaceState | null
  /** 替换期间设在打开的那张上。 */
  replacing: Entry | null
  /** 正被替换时又打开了：面板已经在位，轮到它替换别人时进场一开始就算完成。 */
  isEnteringInPlace: boolean
}

/** 同一次更新里一起关掉的一叠模态面板（「全部关闭」）。 */
export interface ClosingGroup {
  /** 从下到上。 */
  members: Entry[]
  /** 对话框还没离开顶层的成员。 */
  pending: Set<Entry>
  /** 最底下那张的归还目标，封批时读取。 */
  returnTarget: HTMLElement | null
  reported?: boolean
}

export interface StackState {
  shape: number
  entries: Entry[]
  /** 每组（一个 document 的模态面板、非模态面板）实际呈现的顺序。 */
  shownOrder: WeakMap<Document, { modal: Entry[], nonModal: Entry[] }>
  /** 装了按压监听的 document，值是拆掉监听的函数。 */
  listenedDocuments: WeakMap<Document, () => void>
  /** 本批（一次更新）里打开、关闭的面板；替换就是各配一个。 */
  batchOpened: Entry[]
  batchClosed: Entry[]
  /** 本批第一次翻转时，用户是从哪个控件动手的。 */
  batchActor: Element | null
  /** 每个 document 最近一次按压的目标，弱引用。 */
  lastPress: WeakMap<Document, { target: WeakRef<Element>, at: number }>
  /** 替换者在本批关掉了的被替换面板；本批配对定下来后再决定是否丢掉。 */
  pendingDrops: Entry[]
  /** 还欠着「把焦点移进自己」的替换者。 */
  pendingReplaceFocus: Entry | null
  /** 本批配成的一对，以及替换者原来的打开者：本批后来又有翻转就撤销。 */
  batchPair: { replaced: Entry, replacer: Entry, replacerOpener: HTMLElement | null } | null
  closingTogether: Map<Entry, ClosingGroup>
  /** 卸载又在同一批重新登记时沿用名次；标了 closed 的名次已经用掉。 */
  rankByKey: WeakMap<object, Rank & { isClosed: boolean, detachedBatch: number | null }>
  currentBatch: number
  nextSeq: number
  isBatchDirty: boolean
  isSealScheduled: boolean
  /** 切换器某一步呈现时让出焦点的那个元素（人在流程上面那张面板里）；下一次重排顶层时再落回去。 */
  focusToKeep: WeakMap<Document, HTMLElement>
}

const STACK_PROTOCOL_VERSION = 1
const STACK_STATE_KEY = Symbol.for(`astryx-vue.bottomSheetStack.v${STACK_PROTOCOL_VERSION}`)

function createStackState(): StackState {
  return {
    shape: STACK_PROTOCOL_VERSION,
    entries: [],
    shownOrder: new WeakMap(),
    listenedDocuments: new WeakMap(),
    batchOpened: [],
    batchClosed: [],
    batchActor: null,
    lastPress: new WeakMap(),
    pendingDrops: [],
    pendingReplaceFocus: null,
    batchPair: null,
    closingTogether: new Map(),
    rankByKey: new WeakMap(),
    currentBatch: 0,
    nextSeq: 0,
    isBatchDirty: false,
    isSealScheduled: false,
    focusToKeep: new WeakMap(),
  }
}

function readSharedState(): StackState {
  const holder = globalThis as unknown as Record<symbol, unknown>
  const shared = holder[STACK_STATE_KEY] as StackState | undefined
  if (shared?.shape === STACK_PROTOCOL_VERSION)
    return shared
  const created = createStackState()
  holder[STACK_STATE_KEY] = created
  return created
}

export const state: StackState = readSharedState()

/** 只给测试用：把共享状态清回初始值。 */
export function resetStackState(): void {
  Object.assign(state, createStackState())
}

export function findEntry(key: object): Entry | undefined {
  return state.entries.find(entry => entry.key === key)
}

/**
 * 一次 Vue 更新算一批。宿主都在 post 回调里调登记表，同一次刷新里的调用在同一批；
 * 刷新结束后的微任务封批，之后的调用就是下一批了。
 */
export function scheduleSeal(seal: () => void): void {
  if (state.isSealScheduled)
    return
  state.isSealScheduled = true
  queueMicrotask(() => {
    state.isSealScheduled = false
    seal()
  })
}

export function compareRank(a: Entry, b: Entry): number {
  if (a.rank.batch !== b.rank.batch)
    return a.rank.batch - b.rank.batch
  // 同一批按树序：文档里靠前（包括包含另一个）的在下面。
  const aEl = a.getTreeAnchor?.() ?? a.getElement()
  const bEl = b.getTreeAnchor?.() ?? b.getElement()
  if (aEl != null && bEl != null && aEl !== bEl) {
    const position = aEl.compareDocumentPosition(bEl)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING)
      return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING)
      return 1
  }
  return a.rank.seq - b.rank.seq
}

/** 一组（document + 是否模态）的面板，从下到上。 */
export function sortedEntries(doc: Document, isModal: boolean): Entry[] {
  return state.entries
    .filter(entry => entry.doc === doc && entry.isModal === isModal)
    .sort(compareRank)
}

export function groupOf(entry: Entry): Entry[] {
  return sortedEntries(entry.doc, entry.isModal)
}

export function getShownOrder(doc: Document, isModal: boolean): Entry[] {
  const orders = state.shownOrder.get(doc)
  if (orders == null)
    return []
  return isModal ? orders.modal : orders.nonModal
}

export function setShownOrder(doc: Document, isModal: boolean, order: Entry[]): void {
  const orders = state.shownOrder.get(doc) ?? { modal: [], nonModal: [] }
  if (isModal)
    orders.modal = order
  else
    orders.nonModal = order
  state.shownOrder.set(doc, orders)
}

/**
 * 记下每个 document 最近一次按压：pointerdown、click（指针、键盘激活、代码触发都会有）、keydown。
 * 捕获阶段监听，每个 document 一套，随第一张登记的面板装上，最后一张离开时拆掉。
 */
export function listenForPresses(doc: Document): void {
  if (state.listenedDocuments.has(doc))
    return
  const record = (event: Event): void => {
    if (event.target instanceof Element)
      state.lastPress.set(doc, { target: new WeakRef(event.target), at: Date.now() })
  }
  doc.addEventListener('pointerdown', record, true)
  doc.addEventListener('click', record, true)
  doc.addEventListener('keydown', record, true)
  state.listenedDocuments.set(doc, () => {
    doc.removeEventListener('pointerdown', record, true)
    doc.removeEventListener('click', record, true)
    doc.removeEventListener('keydown', record, true)
    state.lastPress.delete(doc)
  })
}

export function stopListeningForPresses(doc: Document): void {
  if (state.entries.some(entry => entry.doc === doc))
    return
  const remove = state.listenedDocuments.get(doc)
  if (remove != null) {
    state.listenedDocuments.delete(doc)
    remove()
  }
}

/**
 * 按压只在新鲜时算数：按钮的处理函数在同一个任务里几毫秒后就翻转面板。
 * 晚到的翻转（保存完成后才换步骤）不算那次按压干的，改看焦点。
 * 按压落在的面板已经关了或被替换了，这次按压也作废。
 */
const PRESS_ACTOR_WINDOW_MS = 1000

function isPressSpent(target: Element, flipping: Entry): boolean {
  const owning = state.entries.find((entry) => {
    const element = entry.getElement()
    return entry.doc === flipping.doc && element != null && element.contains(target)
  })
  if (owning == null || owning === flipping)
    return false
  return !owning.isOpen || owning.replace != null
}

function actorFor(doc: Document, flipping: Entry): Element | null {
  const press = state.lastPress.get(doc)
  const target = press?.target.deref()
  if (
    press != null
    && target != null
    && target.isConnected
    && Date.now() - press.at <= PRESS_ACTOR_WINDOW_MS
    && !isPressSpent(target, flipping)
  ) {
    return target
  }
  return doc.activeElement
}

/** 记一次本批的翻转；是本批第一次时顺便记下是谁动的手。 */
export function recordFlip(entry: Entry, flip: 'opened' | 'closed'): void {
  if (state.batchOpened.length === 0 && state.batchClosed.length === 0)
    state.batchActor = actorFor(entry.doc, entry)
  ;(flip === 'opened' ? state.batchOpened : state.batchClosed).push(entry)
}

/**
 * ChatVirtualizer 各模块共用的可变状态和外部接口。状态是一个普通对象，
 * 不进 Vue 的响应式：它们只在滚动、测量和修正轮里读写，变了也不需要重新渲染。
 */
import type { RowSizes } from './chatVirtualizerSizes.js'
import type { SpacerElements } from './chatVirtualizerSpacers.js'
import type { RowGeometry, RowWindow, ScrollMode } from './chatVirtualizerTypes.js'

export interface VirtualizerState {
  geo: RowGeometry
  mode: ScrollMode
  /**
   * 列表自己最近写下的 scrollTop。滚动事件读到的值和它对得上，才算列表自己的回声。
   * 不用时间窗口：时间窗口会吞掉窗口期里用户真正的滚动。
   */
  progTarget: number | null
  /** scrollTop 最近一次是不是用户挪的。是的话，修正轮从实时 scrollTop 重新取参照行。 */
  userScrolled: boolean
  /** 贴底跟随时，用户自己从列表上次放的位置往上挪了多少。 */
  userAway: number
  lastEventScrollTop: number | null
  lastUserEventAt: number
  geoChanged: boolean
  /** 声明的目标还在收敛：期间滚动事件不改参照系，每轮都继续往目标写。 */
  converging: boolean
  /** 目标收敛期间估价不动，免得目标在几何里被挪走。 */
  priceFreeze: boolean
  /** 手指在滚：列表一律不写 scrollTop，修正由顶部 spacer 吸收。 */
  gestureActive: boolean
  /** 这次手指滚动里用户有没有真的挪过（只算非回声的滚动）。 */
  gestureMoved: boolean
  gestureAdj: number
  /** 挂载模式下内容起点在滚动范围里的位置，以及内容下方调用方自己的内容高度。 */
  origin: number
  below: number
  /** 滚动容器就是整页滚动者。 */
  isPageViewport: boolean
  viewportChangedAt: number
  passViewportHeight: number | null
  /** 视口尺寸变了之后，浏览器还可能自己写一次滚动；那一次要还原到原来那一行。 */
  isRestoreArmed: boolean
  prevScroller: HTMLElement | null
  frames: { retry: number | null, release: number | null, restore: number | null, flush: number | null }
}

export function createVirtualizerState(): VirtualizerState {
  return {
    geo: { offsets: [], total: 0, keys: [], index: new Map() },
    mode: { kind: 'end', distance: 0 },
    progTarget: null,
    userScrolled: false,
    userAway: 0,
    lastEventScrollTop: null,
    lastUserEventAt: 0,
    geoChanged: false,
    converging: true,
    priceFreeze: true,
    gestureActive: false,
    gestureMoved: false,
    gestureAdj: 0,
    origin: 0,
    below: 0,
    isPageViewport: false,
    viewportChangedAt: Number.NEGATIVE_INFINITY,
    passViewportHeight: null,
    isRestoreArmed: false,
    prevScroller: null,
    frames: { retry: null, release: null, restore: null, flush: null },
  }
}

/** 引擎从组件读的东西，全部是实时读取。 */
export interface VirtualizerHost<T> {
  getScroller: () => HTMLElement | null
  /** 挂载模式并且元素已经拿到。 */
  hasHostScroller: () => boolean
  getData: () => readonly T[]
  getKeys: () => readonly string[]
  getEstimatedItemSize: () => number | ((item: T, index: number) => number)
  getItemType: () => ((item: T, index: number) => string) | undefined
  getOverscan: () => { top: number, bottom: number }
  getEndThreshold: () => number
  getWin: () => RowWindow
  setWin: (win: RowWindow) => void
  getPinnedKey: () => string | null
  getTailKey: () => string | null
  isFingerScroll: () => boolean
  els: SpacerElements
  rowEls: Map<string, HTMLElement>
  sizes: RowSizes<T>
}

export function cancelFrame(state: VirtualizerState, name: keyof VirtualizerState['frames']): void {
  const id = state.frames[name]
  if (id !== null)
    cancelAnimationFrame(id)
  state.frames[name] = null
}

/** 在某个帧槽里排一帧；同一槽连续排只留最后一次。 */
export function scheduleFrame(state: VirtualizerState, name: keyof VirtualizerState['frames'], run: () => void): void {
  cancelFrame(state, name)
  state.frames[name] = requestAnimationFrame(() => {
    state.frames[name] = null
    run()
  })
}

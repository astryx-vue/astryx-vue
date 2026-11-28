/**
 * ChatVirtualizer 的修正轮：按旧几何写 spacer → 一次读完位置 → 量新挂的行 → 重算几何 →
 * 按新几何写 spacer 和 scrollTop → 再读一次 scrollTop 认领浏览器自己挪的位置。
 * 每轮最多强制两次布局。另有声明（暴露的两个方法）和手指滚动结束时的交接。
 */
import type { SizeEstimateOptions } from './chatVirtualizerSizes.js'
import type { VirtualizerHost, VirtualizerState } from './chatVirtualizerState.js'
import type { AnchorMode, ScrollMode, ViewportRead } from './chatVirtualizerTypes.js'
import { scrollportTop } from '@astryx-vue/core'
import { anchorAt, buildGeometry, computeWindow, targetFor } from './chatVirtualizerGeometry.js'
import { writeSpacers } from './chatVirtualizerSpacers.js'
import { scheduleFrame } from './chatVirtualizerState.js'
import { readViewport } from './chatVirtualizerTypes.js'

/** 「声明的目标到了没有」的容差，和 endThreshold（用户意图）是两回事。 */
const CONVERGE_EPSILON_PX = 4

/** 手指滚动结束在弹性回弹里时，写 scrollTop 会把回弹直接按到边上。 */
function isBouncing(vp: ViewportRead): boolean {
  return vp.scrollTop < 0 || vp.scrollTop > Math.max(0, vp.scrollHeight - vp.clientHeight) + 1
}

export interface VirtualizerPass {
  sync: () => void
  declare: (mode: ScrollMode) => void
  flushGesture: () => void
  /** 内容零点在画面上的位置（手指滚动期间带上 spacer 吸收的偏移）。 */
  paintOrigin: () => number
}

export function createVirtualizerPass<T>(state: VirtualizerState, host: VirtualizerHost<T>): VirtualizerPass {
  const paintOrigin = (): number => state.origin + state.gestureAdj
  const estimateOptions = (): SizeEstimateOptions<T> => ({ estimatedItemSize: host.getEstimatedItemSize(), getItemType: host.getItemType() })

  const spacers = (): void => writeSpacers(host.els, {
    geo: state.geo,
    win: host.getWin(),
    pinnedKey: host.getPinnedKey(),
    tailKey: host.getTailKey(),
    gestureAdj: state.gestureAdj,
  })

  const recompute = (): void => {
    const data = host.getData()
    const options = estimateOptions()
    state.geo = buildGeometry(host.getKeys(), (key, i) => host.sizes.sizeOf(options, key, data[i], i))
  }

  const measureOrigin = (el: HTMLElement, vp: ViewportRead): void => {
    // 自带容器：内容从滚动盒子顶上开始，下面也没有别的东西。
    if (!host.hasHostScroller()) {
      state.origin = 0
      state.below = 0
      return
    }
    const top = host.els.top
    if (!top)
      return
    state.origin = top.getBoundingClientRect().top - scrollportTop(el) + vp.scrollTop
    state.below = Math.max(0, vp.scrollHeight - state.origin - state.geo.total)
  }

  const target = (mode: ScrollMode, clientHeight: number): number | null =>
    targetFor(state.geo, mode, { clientHeight, origin: paintOrigin(), below: state.below })

  /** 量出来的参照行：直接读行的位置，不靠推算（spacer 在最顶上被夹住时推算会错）。 */
  const anchorFromPaint = (el: HTMLElement, height: number): AnchorMode | null => {
    const viewportTop = scrollportTop(el)
    let best: AnchorMode | null = null
    for (const [key, rowEl] of host.rowEls) {
      if (!rowEl.isConnected || !state.geo.index.has(key))
        continue
      const rect = rowEl.getBoundingClientRect()
      const top = rect.top - viewportTop
      if (rect.bottom - viewportTop <= 0 || top >= height)
        continue
      if (best === null || top < best.viewportOffset)
        best = { kind: 'anchor', key, viewportOffset: top }
    }
    return best
  }

  const sync = (): void => {
    const el = host.getScroller()
    if (!el)
      return
    spacers()
    const vp = readViewport(el)
    const entry = vp.scrollTop
    if (state.isPageViewport && state.passViewportHeight !== null && vp.clientHeight !== state.passViewportHeight)
      state.isRestoreArmed = true
    state.passViewportHeight = vp.clientHeight
    measureOrigin(el, vp)
    // 用户最近挪过位置时，从实时 scrollTop 重取参照行（滚动事件比帧晚一拍）。
    if (state.mode.kind === 'anchor' && state.userScrolled && !state.converging && state.geo.keys.length > 0)
      state.mode = anchorAt(state.geo, entry, paintOrigin())
    // 只量第一次挂上的行，免得它带着估价画出来顶歪下面所有行；后续变化走 ResizeObserver。
    for (const [key, rowEl] of host.rowEls) {
      if (!host.sizes.sizes.has(key) && host.sizes.record(key, rowEl.offsetHeight))
        state.geoChanged = true
    }
    const held = state.gestureActive && state.geo.keys.length > 0 ? anchorAt(state.geo, entry, paintOrigin()) : null
    if (host.sizes.reprice(estimateOptions(), !state.converging && !state.priceFreeze, state.lastUserEventAt))
      state.geoChanged = true
    recompute()
    if (held !== null) {
      const t = target(held, vp.clientHeight)
      if (t !== null)
        state.gestureAdj -= t - entry
    }
    spacers()

    if (state.converging)
      state.geoChanged = true
    let goal = target(state.mode, vp.clientHeight)
    // 盯住的行不在数据里了：回到贴底跟随，不然收敛永远结束不了。
    if (goal === null) {
      state.converging = false
      if (host.getData().length > 0) {
        state.mode = { kind: 'end', distance: 0 }
        state.userAway = 0
        state.geoChanged = true
        goal = target(state.mode, vp.clientHeight)
      }
    }
    let wrote: number | null = null
    if (goal !== null && state.geoChanged && !state.gestureActive) {
      state.geoChanged = false
      if (Math.abs(entry - goal) > 0.5) {
        el.scrollTop = goal
        wrote = goal
      }
    }
    const actual = el.scrollTop
    if (wrote !== null) {
      state.progTarget = actual
      // 写入被夹住了：下一帧再来一次。
      if (Math.abs(actual - wrote) > 1) {
        state.geoChanged = true
        scheduleFrame(state, 'retry', sync)
      }
    }
    if (state.converging && goal !== null && host.getData().length > 0 && Math.abs(actual - goal) <= CONVERGE_EPSILON_PX) {
      // 到了目标也要等下一帧几何稳定了再一起放开，否则会把半路的位置当成新的参照。
      if (state.priceFreeze) {
        scheduleFrame(state, 'release', () => {
          state.converging = false
          state.priceFreeze = false
          state.geoChanged = true
          sync()
        })
      }
      else {
        state.converging = false
      }
    }
    // 窗口按目标位置算，目标还没落地时目的地也已经渲染好；手指在滚时按实际位置算。
    const overscan = host.getOverscan()
    const next = computeWindow(state.geo, {
      top: goal === null || state.gestureActive ? actual : goal,
      clientHeight: vp.clientHeight,
      origin: paintOrigin(),
      overscanTop: overscan.top,
      overscanBottom: overscan.bottom,
    })
    const cur = host.getWin()
    if (next.start !== cur.start || next.end !== cur.end) {
      state.geoChanged = true
      host.setWin(next)
    }
    // 这一轮里 scrollTop 动了（列表写的或浏览器自己夹的），下一帧那个滚动事件归列表。
    if (actual !== entry)
      state.progTarget = actual
  }

  const declare = (mode: ScrollMode): void => {
    state.mode = mode
    state.priceFreeze = true
    state.userScrolled = false
    state.userAway = 0
    state.converging = true
    state.geoChanged = true
    sync()
  }

  const flushGesture = (): void => {
    state.frames.flush = null
    const el = host.getScroller()
    if (!el || !state.gestureActive)
      return
    const vp = readViewport(el)
    if (isBouncing(vp)) {
      scheduleFrame(state, 'flush', flushGesture)
      return
    }
    state.gestureActive = false
    const max = Math.max(0, vp.scrollHeight - vp.clientHeight)
    // 从停下的位置重新确定参照系。手指真挪过才重新判断是否贴底；只是手指按着、
    // 列表自己在长，就保留原来的参照系。
    if (!state.converging) {
      const atEnd = state.gestureMoved ? max - vp.scrollTop <= host.getEndThreshold() : state.mode.kind === 'end'
      state.mode = atEnd
        ? { kind: 'end', distance: 0 }
        : (anchorFromPaint(el, vp.clientHeight) ?? anchorAt(state.geo, vp.scrollTop, paintOrigin()))
      state.userAway = 0
      state.userScrolled = false
    }
    state.gestureAdj = 0
    state.geoChanged = true
    sync()
  }

  return { sync, declare, flushGesture, paintOrigin }
}

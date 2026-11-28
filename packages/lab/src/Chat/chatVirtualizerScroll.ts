/**
 * ChatVirtualizer 的滚动事件：分清这次滚动是列表自己的回声、浏览器因为视口变化写的，
 * 还是读者的；据此离开或重新进入贴底跟随，并按新位置挪窗口。处理函数只读不写 DOM。
 */
import type { VirtualizerPass } from './chatVirtualizerPass.js'
import type { VirtualizerHost, VirtualizerState } from './chatVirtualizerState.js'
import { anchorAt, computeWindow } from './chatVirtualizerGeometry.js'
import { cancelFrame, scheduleFrame } from './chatVirtualizerState.js'
import { readViewport } from './chatVirtualizerTypes.js'

/** 窗口尺寸变化后这么久以内、没有手指的滚动算浏览器的。Safari 旋转后的最后一次滚动落在这段时间里。读者的输入会提前结束它。 */
export const VIEWPORT_SETTLE_MS = 500

export function createScrollHandler<T>(state: VirtualizerState, host: VirtualizerHost<T>, pass: VirtualizerPass): () => void {
  return () => {
    const el = host.getScroller()
    if (!el)
      return
    const vp = readViewport(el)
    const isFinger = host.isFingerScroll()
    // 用户的位移从列表上次写下的位置量起，而不是从上一个事件量起。
    const lastWrite = state.progTarget
    const isOwnEcho = lastWrite !== null && Math.abs(vp.scrollTop - lastWrite) <= 1
    // 视口变尺寸时浏览器自己写的滚动：在这次变化的修正轮之前（高度还没被读过），
    // 或者紧随其后一次。手指在滚时位置归手指。
    const isViewportMove = state.isPageViewport && !isFinger && !isOwnEcho && (
      (state.passViewportHeight !== null && vp.clientHeight !== state.passViewportHeight)
      || (state.isRestoreArmed && performance.now() - state.viewportChangedAt < VIEWPORT_SETTLE_MS)
    )
    const isEcho = isViewportMove || isOwnEcho
    if (isViewportMove) {
      state.userScrolled = false
      if (state.isRestoreArmed && state.frames.restore === null) {
        state.isRestoreArmed = false
        state.geoChanged = true
        scheduleFrame(state, 'restore', pass.sync)
      }
    }
    // 回声的期待是粘性的：一帧里多次改位置会排出多个读到同一终值的事件，只有对不上的才清掉。
    if (!isEcho) {
      state.progTarget = null
      state.userScrolled = true
      state.lastUserEventAt = performance.now()
    }
    const prevEvent = state.lastEventScrollTop
    state.lastEventScrollTop = vp.scrollTop
    if (isFinger) {
      if (!state.gestureActive) {
        // 手指开始滚动是意图信号，和滚轮一样打断收敛。
        state.gestureActive = true
        state.gestureMoved = false
        state.converging = false
        state.priceFreeze = false
      }
      cancelFrame(state, 'flush')
    }
    if (state.gestureActive && !isEcho)
      state.gestureMoved = true
    if (!isEcho && !state.converging) {
      const g = state.geo
      const dist = vp.scrollHeight - vp.clientHeight - vp.scrollTop
      // 原生锚定关掉后，浏览器自己唯一会做的是把位置夹到变短的底边上，那不是用户的位移。
      const landedAtBottom = dist < 1
      const anchorHere = (): void => {
        state.mode = anchorAt(g, vp.scrollTop, pass.paintOrigin())
        state.userAway = 0
      }
      if (g.keys.length === 0) {
        state.mode = { kind: 'end', distance: 0 }
        state.userAway = 0
      }
      else if (state.mode.kind === 'end') {
        // 离开跟随只看用户自己的位移：跟随时尾部一直在长，离底距离里混着列表自己的移动。
        const from = lastWrite ?? prevEvent
        if (from !== null && !landedAtBottom)
          state.userAway = Math.max(0, state.userAway + (from - vp.scrollTop))
        if (state.userAway > host.getEndThreshold())
          anchorHere()
      }
      else if (dist <= host.getEndThreshold()) {
        state.mode = { kind: 'end', distance: 0 }
        state.userAway = 0
      }
      else {
        anchorHere()
      }
    }
    const overscan = host.getOverscan()
    const next = computeWindow(state.geo, {
      top: vp.scrollTop,
      clientHeight: vp.clientHeight,
      origin: pass.paintOrigin(),
      overscanTop: overscan.top,
      overscanBottom: overscan.bottom,
    })
    const cur = host.getWin()
    if (next.start !== cur.start || next.end !== cur.end) {
      state.geoChanged = true
      host.setWin(next)
    }
  }
}

import type { BottomSheetReplacedMotion, BottomSheetReplaceMotion } from './stack/stackState.js'

/**
 * 面板组件内部的状态：比公开的 `BottomSheetState` 多一个 `retained`，
 * 那是替换交接里被替换的面板原地留着、向下对齐、再淡出的那段。
 */
export type BottomSheetPanelState = 'hidden' | 'open' | 'retained' | 'exiting'

/** 面板向宿主报告的动作：公开的进场、退场，加上替换交接里的对齐和淡出。 */
export type BottomSheetPanelMotion = BottomSheetReplaceMotion

/** 某个状态下面板正在走的动作；静止就是 `null`。 */
export function motionForPanelState(
  state: BottomSheetPanelState,
  retainedMotion: BottomSheetReplacedMotion,
): BottomSheetPanelMotion | null {
  if (state === 'open')
    return 'entering'
  if (state === 'exiting')
    return 'exiting'
  if (state === 'retained')
    return retainedMotion === 'covered' ? null : retainedMotion
  return null
}

/** 公开的动作事件只有进场和退场。 */
export function isPublicMotion(motion: BottomSheetPanelMotion): motion is 'entering' | 'exiting' {
  return motion === 'entering' || motion === 'exiting'
}

import type { ComputedRef, Ref } from 'vue'
import type { BottomSheetPanelMotion } from '../panelState.js'
import type { BottomSheetSwitcherPhase } from '../switcher.js'
import { computed, shallowRef, watch } from 'vue'

type RetainedPhase = 'covered' | 'aligning' | 'fading' | 'exiting'

interface SheetTransition {
  enteringId: string | null
  retainedId: string | null
  retainedPhase: RetainedPhase | null
  alignmentOffset: number
  isAlignmentComplete: boolean
}

const IDLE: SheetTransition = Object.freeze({
  enteringId: null,
  retainedId: null,
  retainedPhase: null,
  alignmentOffset: 0,
  isAlignmentComplete: false,
})

const ALIGNMENT_THRESHOLD_PX = 1

function transitionForChange(previous: string | null, next: string | null): SheetTransition {
  if (previous == null)
    return IDLE
  if (next == null)
    return { ...IDLE, retainedId: previous, retainedPhase: 'exiting' }
  return { ...IDLE, enteringId: next, retainedId: previous, retainedPhase: 'covered' }
}

/** 被留下的那步要往下移多少，才能和进场那步停下来的顶边对齐。进场那步的定位层不跟着进场位移走，它的顶边就是停的地方。 */
function alignmentOffsetFor(entering: HTMLElement | null, retained: HTMLElement | null): number {
  if (entering == null || retained == null)
    return 0
  const enteringTop = (entering.parentElement ?? entering).getBoundingClientRect().top
  return Math.max(0, enteringTop - retained.getBoundingClientRect().top)
}

export interface SwitcherTransition {
  /** 交接期间被留下的那步，或者流程关掉时正在滑出的最后那步。 */
  retainedId: ComputedRef<string | null>
  phaseOf: (id: string) => BottomSheetSwitcherPhase
  alignmentOffsetOf: (id: string) => number
  onEnterStart: (id: string) => void
  onComplete: (id: string, motion: BottomSheetPanelMotion) => void
  dropStep: (id: string) => void
}

/**
 * 切换器的交接状态机：换到下一步时新的一步从下面升上来，比它高的上一步同时往下移到顶边对齐，
 * 两边都走完后上一步淡出；整段流程关掉时最后那步滑出。
 */
export function useSwitcherTransition(options: {
  activeId: Readonly<Ref<string | null>>
  hasStep: (id: string) => boolean
  getPanel: (id: string) => HTMLElement | null
}): SwitcherTransition {
  const transition = shallowRef<SheetTransition>(IDLE)

  watch(options.activeId, (next, previous) => {
    const change = transitionForChange(previous, next)
    transition.value = change.retainedId != null && !options.hasStep(change.retainedId) ? IDLE : change
  }, { flush: 'sync' })

  const retainedId = computed(() => transition.value.retainedId)

  function phaseOf(id: string): BottomSheetSwitcherPhase {
    const current = transition.value
    if (id === options.activeId.value)
      return id === current.enteringId ? 'entering' : 'active'
    if (id === current.retainedId)
      return current.retainedPhase ?? 'hidden'
    return 'hidden'
  }

  function alignmentOffsetOf(id: string): number {
    return transition.value.retainedId === id ? transition.value.alignmentOffset : 0
  }

  function onEnterStart(id: string): void {
    const current = transition.value
    if (current.enteringId !== id || current.retainedId == null || current.retainedPhase !== 'covered')
      return
    const offset = alignmentOffsetFor(options.getPanel(id), options.getPanel(current.retainedId))
    if (offset <= ALIGNMENT_THRESHOLD_PX)
      return
    transition.value = { ...current, retainedPhase: 'aligning', alignmentOffset: offset, isAlignmentComplete: false }
  }

  function onComplete(id: string, motion: BottomSheetPanelMotion): void {
    const current = transition.value
    if (motion === 'entering') {
      if (current.enteringId !== id)
        return
      if (current.retainedId == null)
        transition.value = IDLE
      else if (current.retainedPhase === 'aligning' && !current.isAlignmentComplete)
        transition.value = { ...current, enteringId: null }
      else
        transition.value = { ...current, enteringId: null, retainedPhase: 'fading' }
      return
    }
    if (current.retainedId !== id)
      return
    if (motion === 'aligning' && current.retainedPhase === 'aligning') {
      transition.value = current.enteringId == null
        ? { ...current, retainedPhase: 'fading' }
        : { ...current, isAlignmentComplete: true }
      return
    }
    if ((motion === 'fading' || motion === 'exiting') && current.retainedPhase === motion)
      transition.value = IDLE
  }

  /** 被留下的那步卸载了：交接就此结束。 */
  function dropStep(id: string): void {
    if (transition.value.retainedId === id)
      transition.value = IDLE
  }

  return { retainedId, phaseOf, alignmentOffsetOf, onEnterStart, onComplete, dropStep }
}

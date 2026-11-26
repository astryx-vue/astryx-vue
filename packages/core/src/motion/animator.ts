import type { MotionEngine } from './engine/context'
import type { Animator, AnimatorOptions } from './types'
import { installAnimate } from './engine/animate'
import { installAttach } from './engine/attach'
import { installChannelText } from './engine/channelText'
import { installCurveReads } from './engine/curveReads'
import { installDecayStop } from './engine/decayStop'
import { installGroupSync } from './engine/groupSync'
import { installHandles } from './engine/handles'
import { installLandingRun } from './engine/landingRun'
import { installLandings } from './engine/landings'
import { installLookAtShown } from './engine/lookAtShown'
import { installPlay } from './engine/play'
import { installPromotion } from './engine/promotion'
import { installReadSet } from './engine/readSet'
import { installRebase } from './engine/rebase'
import { installRebuild } from './engine/rebuild'
import { installRetire } from './engine/retire'
import { installSampling } from './engine/sampling'
import { installSegments } from './engine/segments'
import { installShownWatch } from './engine/shownWatch'
import { installStartGroups } from './engine/startGroups'
import { initEngineState, initLateEngineState } from './engine/state'

export { END_HOLD_MS, PROMOTION_LINGER_MS } from './engine/constants'
export { defaultIsCoarsePointer, defaultPrefersReducedMotion, isIdentityText, motionNow } from './engine/cssValues'
export { SETTLE_THRESHOLD } from './types'
export type { AnimateOptions, Animator, AnimatorOptions, MotionCurve, MotionHandle, MotionProperty, MotionValues, RebaseOptions, SetOptions, SpringTransition } from './types'

const shared = new WeakMap<HTMLElement, Map<string, Animator>>()

/**
 * The one animator for `element` (and `options.pseudoElement`), created on
 * first use. Code that animates one element from several places (a swipe on
 * x, a removal on y) shares it, so their curves compose in one `translate`
 * track and retargeting one axis leaves the other on its curve; two
 * animators on one element would overwrite each other. `options` apply
 * when it is created; later calls get the same animator. Never `attach` it
 * elsewhere or `dispose` it: it lives as long as the element.
 */
export function animatorFor(
  element: HTMLElement,
  options: AnimatorOptions = {},
): Animator {
  let byPseudo = shared.get(element)
  if (byPseudo == null) {
    byPseudo = new Map()
    shared.set(element, byPseudo)
  }
  const key = options.pseudoElement ?? ''
  let animator = byPseudo.get(key)
  if (animator == null) {
    animator = createMotionEngine(element, options)
    byPseudo.set(key, animator)
  }
  return animator
}

/**
 * Creates an animator for `element` (or for an element attached later).
 *
 * @example
 * ```
 * const animator = createMotionEngine(sheet);
 * // finger lifts at 1200 px/s heading for the detent at 0 (a component
 * // passes the spring of its motion role):
 * animator.animate({y: 0}, {spring: {response: 0.45, dampingRatio: 0.9}, velocity: {y: 1200}});
 * // the finger lands again: where is it right now?
 * const y = animator.get('y', event.timeStamp);
 * animator.stop(['y']);
 * ```
 */
export function createMotionEngine(
  element: HTMLElement | null,
  options: AnimatorOptions = {},
): Animator {
  const engine = { element, options } as MotionEngine
  initEngineState(engine)
  installChannelText(engine)
  installCurveReads(engine)
  installSampling(engine)
  installRebuild(engine)
  installRetire(engine)
  installPromotion(engine)
  installStartGroups(engine)
  installGroupSync(engine)
  installHandles(engine)
  installSegments(engine)
  installShownWatch(engine)
  installLookAtShown(engine)
  installLandings(engine)
  installLandingRun(engine)
  installAttach(engine)
  installReadSet(engine)
  installAnimate(engine)
  installPlay(engine)
  installDecayStop(engine)
  installRebase(engine)
  initLateEngineState(engine)
  engine.animator.attach(element)
  return engine.animator
}

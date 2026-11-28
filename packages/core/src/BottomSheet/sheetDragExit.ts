import type { SheetDragExit } from './sheetRelease.js'
import { animatorFor, SETTLE_THRESHOLD } from '../motion/animator'
import { resolveMoveTiming } from '../motion/resolveMotion'
import { springs } from '../motion/uikit/springs'

/** How many more frames a drag's close looks for its scrim's fade to adopt. */
const MAX_SCRIM_FADE_ADOPT_FRAMES = 3

/** The scrim's fade under a touch drag's close: its duration, and its progress as CSS easing. */
export interface ScrimFade {
  readonly durationMs: number
  readonly easing: string
}

/** Without Web Animations the animator jumps to its end, so the stylesheet's exit runs instead. */
export function supportsWebAnimations(): boolean {
  return typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function'
}

/**
 * How a drag's close plays: the close spring's move from where the finger
 * left the sheet, timed as the shared animator times it, and its progress
 * toward the point where the sheet leaves view. The surface reaches below the
 * screen (the reserve), so it leaves view before the spring settles, and the
 * scrim is clear by then.
 */
export function dragExitFade(element: HTMLElement, exit: SheetDragExit): ScrimFade {
  const viewportHeight = element.ownerDocument.defaultView?.innerHeight ?? 0
  const shown = Math.max(0, viewportHeight - element.getBoundingClientRect().top)
  return resolveMoveTiming(
    element,
    springs.sheetDismissSwipe,
    { from: 0, to: exit.distance, velocity: exit.velocity, epsilon: SETTLE_THRESHOLD.y },
    Math.min(exit.distance, shown),
  )
}

/** The running fade that clears the scrim behind `panel`, if any. */
function clearingScrimFade(panel: HTMLElement): Animation | undefined {
  const dialog = panel.closest('dialog')
  const doc = panel.ownerDocument
  if (dialog == null || typeof doc.getAnimations !== 'function')
    return undefined
  const fades = doc.getAnimations().filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null
    return effect?.target === dialog
      && (animation as CSSTransition).transitionProperty === 'opacity'
      // A fade the drag itself started is replaced by the next style update.
      && Number(effect.getKeyframes().at(-1)?.opacity) === 0
  })
  const onBackdrop = fades.filter(fade => (fade.effect as KeyframeEffect).pseudoElement === '::backdrop')
  // An engine that reports no backdrop effect (WebKit) puts the backdrop's
  // fade on the dialog itself, which runs no opacity transition of its own.
  return (onBackdrop.length > 0 ? onBackdrop : fades.filter(fade => !(fade.effect as KeyframeEffect).pseudoElement)).at(-1)
}

export interface DragExitCallbacks {
  /** The close settled: the scrim's fade is over. */
  onSettled: () => void
  /** The exit motion is complete. */
  complete: () => void
}

/**
 * Plays a touch drag's close on the shared animator with the dismiss swipe's
 * spring, from the release speed. The scrim's CSS fade takes the close's start
 * time, so the two end together. Returns the cleanup: a reopen during the
 * exit takes the sheet back from where it is.
 */
export function playDragExit(element: HTMLElement, exit: SheetDragExit, callbacks: DragExitCallbacks): () => void {
  const handle = animatorFor(element).animate(
    { y: exit.distance },
    { spring: springs.sheetDismissSwipe, velocity: { y: exit.velocity } },
  )
  let isCurrent = true
  let isFinished = false
  let frame: number | null = null
  void handle.started.then((start) => {
    const adopt = (framesLeft: number): void => {
      frame = null
      if (!isCurrent)
        return
      const fade = clearingScrimFade(element)
      if (fade != null)
        fade.startTime = start
      else if (framesLeft > 0 && typeof requestAnimationFrame === 'function')
        frame = requestAnimationFrame(() => adopt(framesLeft - 1))
    }
    adopt(MAX_SCRIM_FADE_ADOPT_FRAMES)
  })
  void handle.finished.then(() => {
    isFinished = true
    callbacks.onSettled()
    if (isCurrent)
      callbacks.complete()
  })
  return () => {
    isCurrent = false
    if (frame != null)
      cancelAnimationFrame(frame)
    if (!isFinished)
      handle.retarget({ y: 0 })
  }
}

/** A hidden sheet can stay mounted, so the exit's offset goes back to 0. */
export function resetDragExit(element: HTMLElement): void {
  animatorFor(element).set({ y: 0 })
}

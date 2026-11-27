/**
 * @file useChatKeyboard.ts
 * @input ChatLayout's root, scroller, dock, message area and composer region,
 *   the keyboard module's height, focus routes and layout guide, the stream
 *   scroll's lock, the motion engine, the touch query and layout viewport
 *   height
 * @output useChatKeyboard: the lift for ChatLayout's dock and message area
 * @position ChatLayout's keyboard behavior (Chat/ChatLayout.vue); internal
 *
 * The composer sits on the keyboard, as in Messages on iOS. Where the layout
 * guide publishes the keyboard's slide, the dock rides it on the compositor.
 */

import type { MaybeRefOrGetter, Ref } from 'vue'
import type { ChatScrollToBottomOptions } from '../composables/useChatStreamScroll.js'
import type { KeyboardTransition } from '../keyboard/keyboardModel.js'
import type { Animator } from '../motion/animator.js'
import { onScopeDispose, readonly, shallowRef, toValue, watch } from 'vue'
import { getInteractionModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { isFollowingNewest } from '../composables/useChatStreamScroll.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { useAttachment } from '../gestures/useAttachment.js'
import { refuseFocusReveal } from '../keyboard/focusReveal.js'
import { followsKeyboard } from '../keyboard/keyboardGeometry.js'
import { findTextEntryControl, getKeyboardHeight, subscribeKeyboardHeight } from '../keyboard/keyboardHeight.js'
import { getKeyboardLayoutGuide, keyboardProfileOf } from '../keyboard/keyboardLayoutGuide.js'
import { deliverTap, watchPans } from '../keyboard/keyboardReveal.js'
import { rideKeyboard } from '../keyboard/rideKeyboard.js'
import { claimTapFocus } from '../keyboard/tapFocus.js'
import { createMotionEngine } from '../motion/animator.js'
import { isCoarsePointer } from '../utils/coarsePointer.js'
import { layoutViewportHeight } from '../utils/layoutViewport.js'
import { TOUCH_QUERY } from '../utils/touchQueries.js'
import { editableToClaim, parkFocus } from './chatKeyboardFocus.js'

export interface UseChatKeyboardOptions {
  /** ChatLayout's root. */
  root: Ref<HTMLElement | null>
  /** The element that scrolls the transcript (the root, or an outer one). */
  scrollRef: Ref<HTMLElement | null>
  /** The dock container, which rests above the keyboard. */
  dock: Ref<HTMLElement | null>
  /** The message area, whose end padding grows by the lift. */
  messages: Ref<HTMLElement | null>
  /** The composer region: its text taps are claimed, and Done parks on it. */
  composer: Ref<HTMLElement | null>
  /**
   * Whether the root scrolls itself (a sticky dock at its bottom) rather
   * than an outer scroller (a fixed dock at the layout viewport's bottom).
   */
  isSelfScrolling: MaybeRefOrGetter<boolean>
  /**
   * The stream scroll's jump to the newest message (useChatStreamScroll), the
   * owner of the transcript's lock.
   */
  scrollToBottom: (options?: ChatScrollToBottomOptions) => void
}

export interface UseChatKeyboardResult {
  /**
   * The part of the keyboard over the dock, CSS px: the dock's offset from
   * its bottom and the room the message area's end padding adds.
   */
  lift: Readonly<Ref<number>>
}

/** A compositor animator that follows the element a ref names. */
function useElementAnimator(element: Ref<HTMLElement | null>): Animator {
  const animator = createMotionEngine(null)
  watch(element, next => animator.attach(next ?? null), { immediate: true, flush: 'sync' })
  onScopeDispose(() => animator.attach(null))
  return animator
}

/**
 * Keeps ChatLayout's composer on top of the software keyboard.
 *
 * @example
 * ```
 * const keyboard = useChatKeyboard({ root, scrollRef, dock, messages, composer, isSelfScrolling, scrollToBottom })
 * // the dock's `bottom` and the message area's end padding read keyboard.lift
 * ```
 */
export function useChatKeyboard(options: UseChatKeyboardOptions): UseChatKeyboardResult {
  const { root, scrollRef, composer, scrollToBottom } = options
  const dock = useElementAnimator(options.dock)
  const messages = useElementAnimator(options.messages)
  // The lift the layout shows (read in render, so styles carry it) and its
  // mirror for the handlers below: the lift the layout has taken.
  const lift = shallowRef(0)
  let liftTaken = 0
  // Set while the guide's ride is under way: the layout waits for it. Each
  // ride's number, so only the latest one hands its translate back.
  let riding = false
  let rideCount = 0
  // Where the last ride took the dock's and the transcript's translates
  // (null: the transcript did not ride), until the layout takes them over.
  let dockTarget: number | null = null
  let messagesTarget: number | null = null
  // Whether the transcript followed its newest message, and where it was
  // scrolled, just before the layout's last change.
  let atEndBefore = false
  let scrollBefore = 0
  // Touch-only work attaches only under a coarse primary pointer (the touch
  // query). Under a fine one, no touch listener is registered.
  const isTouch = useMediaQuery(TOUCH_QUERY)

  // Synchronizes the layout with the keyboard: it subscribes to the layout
  // guide's transitions for the ride, and takes the height a mount finds.
  useAttachment(root, (rootElement) => {
    const win = rootElement.ownerDocument.defaultView
    if (win == null) {
      return () => {}
    }
    const isSelfScrolling = toValue(options.isSelfScrolling)
    // A sticky dock rests at the root's bottom edge, which may sit above or
    // below the layout viewport's; a fixed dock rests at the viewport's.
    // While a keyboard is up the dock rises until it clears the keyboard's
    // cover; without one it rests where the layout puts it.
    const liftFor = (inset: number): number => {
      if (inset <= 0) {
        return 0
      }
      // In layout px, as the root's rect is, under a pinch zoom too.
      const viewportBottom = layoutViewportHeight(win)
      const bottom = isSelfScrolling
        ? rootElement.getBoundingClientRect().bottom
        : viewportBottom
      return Math.max(0, bottom - (viewportBottom - inset))
    }
    // The stream scroll's lock decides whether the transcript follows its
    // newest message, as it does for new content.
    const isAtEnd = (): boolean => {
      const scroller = scrollRef.value
      return scroller != null && isFollowingNewest(scroller)
    }
    // The layout takes the keyboard height's lift once no ride is under way.
    const commit = (): void => {
      if (riding) {
        return
      }
      const next = liftFor(getKeyboardHeight(win))
      if (Math.abs(next - liftTaken) < 0.5) {
        return
      }
      atEndBefore = isAtEnd()
      scrollBefore = scrollRef.value?.scrollTop ?? 0
      lift.value = next
    }

    // The ride plays the curve the guide publishes with each transition: the
    // keyboard's own motion. These are values, not motion roles, since the
    // system moves the keyboard on them whatever the page does.
    const follow = (transition: KeyboardTransition): void => {
      // The dock goes where the guide says the keyboard will be, from the
      // keyboard's start, relative to the layout it rests in now.
      const target = liftTaken - liftFor(transition.to)
      const atEnd = isAtEnd()
      dockTarget = target
      messagesTarget = atEnd ? target : null
      if (!transition.animated) {
        rideCount += 1
        riding = false
        dock.set({ y: target })
        if (atEnd) {
          messages.set({ y: target })
        }
        commit()
        return
      }
      // Under Reduce Motion the animator's default applies: no travel, a
      // cross-fade on a touch screen.
      const shown = { y: target }
      riding = true
      rideCount += 1
      const ride = rideCount
      // On the keyboard's own motion: Gboard's slide.
      const rides = [
        rideKeyboard(dock, shown, transition)?.finished ?? Promise.resolve(true),
      ]
      if (atEnd) {
        rides.push(
          rideKeyboard(messages, shown, transition)?.finished ?? Promise.resolve(true),
        )
      }
      void Promise.all(rides)
        .then(async (done) => {
          // A newer ride took over: it commits when it ends.
          if (!done.every(Boolean) || ride !== rideCount) {
            return
          }
          // Hand back only once the presented animations are over too. So a
          // paused animation, as an inspector holds, is never left on top of
          // the new layout.
          const element = dock.element
          await Promise.all(
            (element?.getAnimations?.() ?? []).map(async animation =>
              animation.finished.catch(() => undefined),
            ),
          )
          if (ride === rideCount) {
            riding = false
            commit()
          }
        })
        .catch(() => undefined)
    }
    // The ride attaches only under a coarse primary pointer, where the guide
    // publishes the keyboard's own slide: Gboard's, in Chrome on Android.
    // Elsewhere the layout follows the height alone.
    const unsubscribe = isTouch.value && keyboardProfileOf(win) === 'chromium'
      ? getKeyboardLayoutGuide(win).subscribe(follow)
      : undefined
    // A height change the guide has no ride for, as for a resize or a
    // rotation, takes its lift at once. This listener comes after the
    // guide's, so a ride claims the change first.
    let reportedHeight = getKeyboardHeight(win)
    const unsubscribeHeight = subscribeKeyboardHeight(win, (event) => {
      if (event.type === 'viewport' && event.height !== reportedHeight) {
        reportedHeight = event.height
        commit()
      }
    })
    // Mounted under a keyboard that is already up: take its place at once.
    commit()
    return () => {
      unsubscribeHeight()
      unsubscribe?.()
      riding = false
    }
  }, () => `${toValue(options.isSelfScrolling)}|${isTouch.value}`)

  // Synchronizes the dock's and the transcript's translates, and the
  // transcript's scroll, with the lift the layout just drew. The translates
  // take the difference, so nothing moves on screen. The newest message stays
  // in view.
  watch(lift, (next) => {
    const moved = next - liftTaken
    if (Math.abs(moved) < 0.5) {
      return
    }
    liftTaken = next
    const dockRode = dockTarget
    const messagesRode = messagesTarget
    dockTarget = null
    messagesTarget = null
    // A ride that ended hands its translate (its target) to the layout; a
    // change no ride covered (a resize) is the layout's alone.
    if (dockRode != null) {
      dock.set({ y: dockRode + moved })
    }
    const scroller = scrollRef.value
    if (scroller == null) {
      return
    }
    // WebKit counts a translated transcript in the scroller's range. So the
    // ride's translate goes before the scroll is set. Otherwise the scroll
    // can stop past the content's end, and the sticky dock rises to meet it.
    if (messagesRode != null) {
      messages.set({ y: 0 })
    }
    if (atEndBefore) {
      scrollToBottom({ behavior: 'instant' })
    }
    // The padding's change may have clamped the scroll already: measure from
    // where it was before the layout changed.
    const shifted = scroller.scrollTop - scrollBefore
    if (messagesRode != null && Math.abs(messagesRode + shifted) >= 0.5) {
      messages.set({ y: messagesRode + shifted })
    }
  }, { flush: 'post' })

  // Synchronizes the composer region with the touch presentation, under a
  // finger in a top-level page only. A desktop browser keeps its own focus,
  // and inside an iframe nothing changes.
  useAttachment(composer, (region) => {
    const win = region.ownerDocument.defaultView
    if (!isTouch.value || !followsKeyboard(win)) {
      return () => {}
    }
    const doc = region.ownerDocument
    trackInteractionModality(doc)
    // The tap route: a tap on the composer's text that would bring up the
    // keyboard focuses here without Safari's reveal, with the caret where the
    // finger lifted, and raises the tap's click once.
    const stopTaps = claimTapFocus(region, {
      claim: editableToClaim,
      deliver: deliverTap,
    })
    // A browser that reveals the composer itself pans the visual viewport
    // after the keyboard's report, while the composer still rides up. Chrome
    // 124 on Android pans by the keyboard's whole height. The reveal-pan
    // watch puts the pan back, so the page does not move.
    const pans = watchPans(win, focused => region.contains(focused))
    const unsubscribePans = subscribeKeyboardHeight(win, (event) => {
      if (event.type === 'viewport') {
        pans.report(event.height)
      }
    })
    // The focus takeover: every other move into the composer's text skips
    // the browser's reveal. The pointer is read again on every blur, so a
    // tablet that docks a mouse drops the takeover. When Done ends entry,
    // focus moves to the region, a group that is no tab stop, so the next
    // tap or Tab starts from the composer. The region is a group only while
    // it is the park's target, with no accessible name.
    region.setAttribute('role', 'group')
    const stopTakeover = refuseFocusReveal(doc, {
      isActive: () => isCoarsePointer(win),
      claim: destination => findTextEntryControl(destination, region),
      park: (origin) => {
        if (findTextEntryControl(origin, region) != null) {
          parkFocus(region, getInteractionModality(doc))
        }
      },
    })
    return () => {
      stopTakeover()
      region.removeAttribute('role')
      unsubscribePans()
      pans.stop()
      stopTaps()
    }
  }, () => isTouch.value)

  return { lift: readonly(lift) }
}

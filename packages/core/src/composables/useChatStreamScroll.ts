import type { MaybeRefOrGetter, Ref } from 'vue'
import { ref, toValue, watch } from 'vue'
import { useMediaQuery } from './useMediaQuery.js'

/** How `scrollToBottom` moves. `instant` skips the spring. */
export interface ChatScrollToBottomOptions {
  /**
   * `instant` jumps in one frame. `spring` eases toward the bottom, and also
   * jumps when the user prefers reduced motion.
   * @default 'spring'
   */
  behavior?: 'instant' | 'spring'
}

export interface UseChatStreamScrollOptions {
  /** The element whose scroll position is followed. */
  scrollRef: Ref<HTMLElement | null>
  /** Turns the listeners and the follow behavior off. @default true */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Distance from the bottom, in pixels, within which a settled scroll locks
   * again. Keep this small so a slight scroll is not yanked back.
   * @default 10
   */
  lockThreshold?: number
  /**
   * Distance from the bottom, in pixels, past which the scroll-to-bottom
   * button is shown.
   * @default 100
   */
  buttonThreshold?: number
  /** How quickly the spring settles. @default 0.7 */
  damping?: number
  /** How fast the spring accelerates. @default 0.05 */
  stiffness?: number
  /** Higher mass makes the spring slower. @default 1.25 */
  mass?: number
}

export interface UseChatStreamScrollReturn {
  /** The user has scrolled up past `buttonThreshold`. */
  isScrolledUp: Ref<boolean>
  /** Auto-scroll is following new content. */
  isLocked: Ref<boolean>
  /** Scroll to the bottom and lock. */
  scrollToBottom: (options?: ChatScrollToBottomOptions) => void
  /** Place `el` at the top of the visible area. Does not change the lock. */
  scrollToMessage: (el: HTMLElement) => void
  /** Lock and scroll to the bottom. */
  lock: () => void
  /** Stop following content. */
  unlock: () => void
  /** Scroll to the bottom only while locked. Call this when content grows. */
  scrollIfLocked: () => void
  /** Scroll so the last `.astryx-chat-message` sits at the top of the view. */
  scrollToLastMessage: () => void
}

const SIXTY_FPS_MS = 1000 / 60
const CHAT_MESSAGE_CLASS = 'astryx-chat-message'

/**
 * Keeps a chat transcript pinned to the bottom while text streams in, and lets
 * go as soon as the reader scrolls up.
 *
 * The first time the transcript becomes scrollable it jumps. Later growth uses
 * a spring, unless reduced motion is requested. Scrolling up — wheel, touch,
 * keyboard, or the scrollbar — unlocks immediately. Settling within
 * `lockThreshold` of the bottom locks again.
 */
export function useChatStreamScroll(options: UseChatStreamScrollOptions): UseChatStreamScrollReturn {
  const {
    scrollRef,
    enabled = true,
    lockThreshold = 10,
    buttonThreshold = 100,
    damping = 0.7,
    stiffness = 0.05,
    mass = 1.25,
  } = options

  const isScrolledUp = ref(false)
  const isLocked = ref(true)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  let locked = true
  let initialFillPending = true
  let velocity = 0
  let animating = false
  let lastTick: number | undefined
  let lastScrollTop = 0
  let lastScrollHeight = 0
  let lastOffsetHeight = 0
  let frame = 0

  function setLocked(next: boolean): void {
    locked = next
    isLocked.value = next
    if (!next) {
      cancelFrame()
      const el = scrollRef.value
      if (el)
        markScrolling(el, false)
    }
  }

  function cancelFrame(): void {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
    animating = false
    velocity = 0
    lastTick = undefined
  }

  function markScrolling(el: HTMLElement, active: boolean): void {
    if (active)
      el.setAttribute('data-astryx-scrolling', '')
    else
      el.removeAttribute('data-astryx-scrolling')
  }

  function jumpToBottom(): void {
    const el = scrollRef.value
    if (!el)
      return
    cancelFrame()
    el.scrollTop = el.scrollHeight - el.clientHeight
    lastScrollTop = el.scrollTop
    markScrolling(el, false)
  }

  function animate(): void {
    const el = scrollRef.value
    if (!el || !locked) {
      if (el)
        markScrolling(el, false)
      cancelFrame()
      return
    }

    if (el.scrollHeight <= el.clientHeight) {
      markScrolling(el, false)
      cancelFrame()
      return
    }

    const target = el.scrollHeight - el.clientHeight
    const diff = target - el.scrollTop

    if (Math.abs(diff) < 0.5 && Math.abs(velocity) < 0.1) {
      el.scrollTop = target
      lastScrollTop = el.scrollTop
      markScrolling(el, false)
      cancelFrame()
      return
    }

    const now = performance.now()
    const tickDelta = lastTick == null ? 1 : (now - lastTick) / SIXTY_FPS_MS
    lastTick = now
    velocity = (damping * velocity + stiffness * diff) / mass
    el.scrollTop += velocity * tickDelta
    lastScrollTop = el.scrollTop
    // A scroll listener may have unlocked while this assignment was applied.
    if (!locked) {
      markScrolling(el, false)
      return
    }
    frame = requestAnimationFrame(animate)
  }

  function startAnimation(): void {
    if (!locked)
      return
    if (prefersReducedMotion.value) {
      jumpToBottom()
      return
    }
    const el = scrollRef.value
    if (el)
      markScrolling(el, true)
    if (!animating) {
      animating = true
      lastTick = undefined
      frame = requestAnimationFrame(animate)
    }
  }

  function scrollToBottom(scrollOptions?: ChatScrollToBottomOptions): void {
    setLocked(true)
    isScrolledUp.value = false
    initialFillPending = false
    if (scrollOptions?.behavior === 'instant') {
      jumpToBottom()
      return
    }
    startAnimation()
  }

  function scrollToMessage(el: HTMLElement): void {
    const container = scrollRef.value
    if (!container)
      return
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const offset = elRect.top - containerRect.top + container.scrollTop
    container.scrollTo({ top: offset, behavior: 'instant' })
    lastScrollTop = container.scrollTop
  }

  function scrollToLastMessage(): void {
    const container = scrollRef.value
    if (!container)
      return
    const messages = container.getElementsByClassName(CHAT_MESSAGE_CLASS)
    const last = messages[messages.length - 1]
    if (last instanceof HTMLElement)
      scrollToMessage(last)
  }

  function lock(): void {
    setLocked(true)
    isScrolledUp.value = false
    startAnimation()
  }

  function unlock(): void {
    setLocked(false)
  }

  function scrollIfLocked(): void {
    if (!toValue(enabled) || !locked)
      return
    const el = scrollRef.value
    if (initialFillPending && el && el.scrollHeight > el.clientHeight) {
      initialFillPending = false
      jumpToBottom()
      return
    }
    startAnimation()
  }

  watch(
    () => [scrollRef.value, toValue(enabled)] as const,
    ([el, isEnabled], _, onCleanup) => {
      if (!el || !isEnabled)
        return

      lastScrollTop = el.scrollTop
      lastScrollHeight = el.scrollHeight
      lastOffsetHeight = el.offsetHeight

      const onScroll = (): void => {
        const { scrollTop, scrollHeight, offsetHeight } = el
        const distance = scrollHeight - scrollTop - offsetHeight
        isScrolledUp.value = distance > buttonThreshold

        const scrollHeightChanged = scrollHeight !== lastScrollHeight
        const offsetHeightChanged = offsetHeight !== lastOffsetHeight
        lastScrollHeight = scrollHeight
        lastOffsetHeight = offsetHeight

        if (scrollHeightChanged || offsetHeightChanged) {
          lastScrollTop = scrollTop
          return
        }

        const isScrollingUp = scrollTop < lastScrollTop
        lastScrollTop = scrollTop
        if (isScrollingUp && locked)
          setLocked(false)
      }

      const onScrollEnd = (): void => {
        const distance = el.scrollHeight - el.scrollTop - el.offsetHeight
        if (distance <= lockThreshold) {
          locked = true
          isLocked.value = true
        }
      }

      const onWheel = (event: WheelEvent): void => {
        if (event.deltaY < 0 && animating)
          setLocked(false)
      }

      const onTouchMove = (): void => {
        if (animating)
          setLocked(false)
      }

      el.addEventListener('scroll', onScroll, { passive: true })
      el.addEventListener('scrollend', onScrollEnd)
      el.addEventListener('wheel', onWheel, { passive: true })
      el.addEventListener('touchmove', onTouchMove, { passive: true })

      const initialFrame = requestAnimationFrame(() => {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTop = el.scrollHeight - el.clientHeight
          lastScrollTop = el.scrollTop
          initialFillPending = false
        }
      })

      onCleanup(() => {
        cancelAnimationFrame(initialFrame)
        cancelFrame()
        el.removeEventListener('scroll', onScroll)
        el.removeEventListener('scrollend', onScrollEnd)
        el.removeEventListener('wheel', onWheel)
        el.removeEventListener('touchmove', onTouchMove)
        markScrolling(el, false)
      })
    },
    { immediate: true },
  )

  return {
    isScrolledUp,
    isLocked,
    scrollToBottom,
    scrollToMessage,
    lock,
    unlock,
    scrollIfLocked,
    scrollToLastMessage,
  }
}

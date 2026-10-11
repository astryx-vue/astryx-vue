import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue } from 'vue'

/** Class that marks a transcript row `useChatNewMessages` watches. */
export const CHAT_MESSAGE_CLASS = 'astryx-chat-message'

export interface UseChatNewMessagesOptions {
  /**
   * Whether the transcript is currently pinned to the bottom.
   * New rows are not flagged while this is true, because the reader is
   * already looking at them.
   */
  isLocked: MaybeRefOrGetter<boolean>
  /** Called on every content-size change, including streaming growth. */
  onResize?: () => void
}

export interface UseChatNewMessagesReturn {
  /** A new message row arrived while the transcript was unlocked. */
  hasNewMessages: Ref<boolean>
  /** Clear the new-message flag. */
  dismiss: () => void
  /**
   * Attach to the element that wraps the message rows.
   * Observes size changes, including when the element mounts late.
   */
  contentRef: (el: HTMLElement | null) => void
}

/**
 * Notices when a new `.astryx-chat-message` row appears while the reader is
 * scrolled up, and reports every content resize so a locked transcript can
 * keep following a stream.
 */
export function useChatNewMessages(options: UseChatNewMessagesOptions): UseChatNewMessagesReturn {
  const hasNewMessages = ref(false)
  let lastMessage: Element | null = null
  let observed: HTMLElement | null = null
  let observer: ResizeObserver | null = null

  function handleResize(el: HTMLElement): void {
    options.onResize?.()
    const messages = el.getElementsByClassName(CHAT_MESSAGE_CLASS)
    const last = messages.length > 0 ? messages[messages.length - 1] : null
    if (last && last !== lastMessage) {
      lastMessage = last
      if (!toValue(options.isLocked))
        hasNewMessages.value = true
    }
  }

  function detach(): void {
    observer?.disconnect()
    observer = null
  }

  function contentRef(el: HTMLElement | null): void {
    if (el === observed)
      return
    detach()
    observed = el
    if (!el || typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(() => {
      handleResize(el)
    })
    observer.observe(el)
  }

  function dismiss(): void {
    hasNewMessages.value = false
  }

  onScopeDispose(detach)

  return { hasNewMessages, dismiss, contentRef }
}

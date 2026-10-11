import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ChatDensity, ChatMessageSender } from './types.js'
import { inject } from 'vue'

/** What a `ChatMessage` tells the bubble and metadata inside it. */
export interface ChatMessageContextValue {
  sender: ComputedRef<ChatMessageSender>
  density: ComputedRef<ChatDensity>
}

export const chatMessageContextKey: InjectionKey<ChatMessageContextValue> = Symbol('astryx-chat-message')

export function useChatMessageContext(): ChatMessageContextValue | undefined {
  return inject(chatMessageContextKey, undefined)
}

/** What a `ChatMessageList` tells the messages inside it. */
export interface ChatListContextValue {
  density: ComputedRef<ChatDensity>
}

export const chatListContextKey: InjectionKey<ChatListContextValue> = Symbol('astryx-chat-list')

export function useChatListContext(): ChatListContextValue | undefined {
  return inject(chatListContextKey, undefined)
}

/** What a `ChatLayout` tells the message list so scroll and resize stay in sync. */
export interface ChatLayoutContextValue {
  /** The element that actually scrolls. */
  scrollContainer: Ref<HTMLElement | null>
  /** Attach to the element whose height should be observed. */
  contentRef: (el: HTMLElement | null) => void
}

export const chatLayoutContextKey: InjectionKey<ChatLayoutContextValue> = Symbol('astryx-chat-layout')

export function useChatLayoutContext(): ChatLayoutContextValue | undefined {
  return inject(chatLayoutContextKey, undefined)
}

import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ChatComposerInputControl, ChatDensity, ChatMessageSender } from './types.js'
import { inject } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

/** What a `ChatMessage` tells the bubble and metadata inside it. */
export interface ChatMessageContextValue {
  sender: ComputedRef<ChatMessageSender>
  density: ComputedRef<ChatDensity>
}

export const chatMessageContextKey = defineLayerScopedKey<ChatMessageContextValue | undefined>(
  'astryx-chat-message',
  undefined,
)

export function useChatMessageContext(): ChatMessageContextValue | undefined {
  return readLayerScoped(chatMessageContextKey)
}

/** What a `ChatMessageList` tells the messages inside it. */
export interface ChatListContextValue {
  density: ComputedRef<ChatDensity>
}

export const chatListContextKey = defineLayerScopedKey<ChatListContextValue | undefined>('astryx-chat-list', undefined)

export function useChatListContext(): ChatListContextValue | undefined {
  return readLayerScoped(chatListContextKey)
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

/** Draft and actions shared by the composer shell, its input, and the send button. */
export interface ChatComposerContextValue {
  value: ComputedRef<string>
  placeholder: ComputedRef<string>
  isDisabled: ComputedRef<boolean>
  isStopShown: ComputedRef<boolean>
  canSend: ComputedRef<boolean>
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  onStop: () => void
  /** The input assigns this on mount and clears it on unmount. */
  inputControl: Ref<ChatComposerInputControl | null>
}

export const chatComposerContextKey: InjectionKey<ChatComposerContextValue> = Symbol('astryx-chat-composer')

export function useChatComposerContext(): ChatComposerContextValue | undefined {
  return inject(chatComposerContextKey, undefined)
}

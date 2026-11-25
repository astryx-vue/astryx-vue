import type { Ref } from 'vue'
import type { ChatComposerInputHandle, ChatComposerToken } from './types.js'
import { useAstryxMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'

export const PASTE_TOKEN_THRESHOLD = 200

export interface UseChatPasteAsTokenOptions {
  /** Imperative handle of the composer input the chip is inserted into. */
  input: Ref<ChatComposerInputHandle | null>
  /**
   * Pastes longer than this many characters become a chip.
   * @default 200
   */
  threshold?: number
  /** Builds the chip. The default is a neutral badge with a length label. */
  toToken?: (text: string) => ChatComposerToken
}

export interface UseChatPasteAsTokenReturn {
  /** Return true when the paste was turned into a chip. */
  onPaste: (text: string) => boolean
}

/** 粘贴文本的行数和字符数写成一句计数。 */
export type PastedTextLabelFormat = (lines: number, chars: number) => string

/**
 * 粘贴文本小块上的计数。`format` 决定怎么写，组件传当前语言的文案；不传时用英文。
 */
export function pastedTextLabel(text: string, format: PastedTextLabelFormat = chatMessages.en.pastedTextLabel): string {
  return format(text.split('\n').length, text.length)
}

export function useChatPasteAsToken(options: UseChatPasteAsTokenOptions): UseChatPasteAsTokenReturn {
  const threshold = options.threshold ?? PASTE_TOKEN_THRESHOLD
  const messages = useAstryxMessages()
  const toToken = options.toToken ?? ((text: string): ChatComposerToken => ({
    value: text,
    label: pastedTextLabel(text, messages.value.chat.pastedTextLabel),
    variant: 'neutral',
  }))

  function onPaste(text: string): boolean {
    if (text.length <= threshold)
      return false
    options.input.value?.insertToken(toToken(text))
    return true
  }

  return { onPaste }
}

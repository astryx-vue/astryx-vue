import type { Ref } from 'vue'
import type { ChatComposerInputHandle, ChatComposerToken } from './types.js'

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

export function pastedTextLabel(text: string): string {
  const lines = text.split('\n').length
  const chars = text.length
  return lines > 1 ? `${lines} lines, ${chars} chars` : `${chars} chars`
}

function defaultToToken(text: string): ChatComposerToken {
  return {
    value: text,
    label: pastedTextLabel(text),
    variant: 'neutral',
  }
}

export function useChatPasteAsToken(options: UseChatPasteAsTokenOptions): UseChatPasteAsTokenReturn {
  const threshold = options.threshold ?? PASTE_TOKEN_THRESHOLD
  const toToken = options.toToken ?? defaultToToken

  function onPaste(text: string): boolean {
    if (text.length <= threshold)
      return false
    options.input.value?.insertToken(toToken(text))
    return true
  }

  return { onPaste }
}

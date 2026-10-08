import type { Ref } from 'vue'
import { onBeforeUnmount, ref } from 'vue'

const DEFAULT_RESET_AFTER_MS = 2000

export interface CopyToClipboardOptions {
  /**
   * How long `isCopied` stays true after a successful copy, in milliseconds.
   * @default 2000
   */
  resetAfterMs?: number
}

export interface CopyToClipboardReturn {
  /**
   * Write `text` to the clipboard. Resolves `true` and starts the copied
   * state on success; a rejected write is a silent no-op that resolves
   * `false`.
   */
  copy: (text: string) => Promise<boolean>
  /** True for `resetAfterMs` after the most recent successful copy. */
  isCopied: Ref<boolean>
}

/**
 * Copy-to-clipboard behavior with a transient copied flag. Re-copying restarts
 * the reset timer, so a rapid second copy never shortens the confirmation.
 */
export function useCopyToClipboard(options: CopyToClipboardOptions = {}): CopyToClipboardReturn {
  const resetAfterMs = options.resetAfterMs ?? DEFAULT_RESET_AFTER_MS
  const isCopied = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
    }
    catch {
      return false
    }

    isCopied.value = true

    if (resetTimer != null)
      clearTimeout(resetTimer)

    resetTimer = setTimeout(() => {
      resetTimer = null
      isCopied.value = false
    }, resetAfterMs)

    return true
  }

  onBeforeUnmount(() => {
    if (resetTimer != null)
      clearTimeout(resetTimer)
  })

  return { copy, isCopied }
}

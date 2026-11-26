import type { Ref } from 'vue'
import { onScopeDispose, ref } from 'vue'
import { useAnnounce } from './useAnnounce.js'

const DEFAULT_RESET_AFTER_MS = 2000

export interface UseClipboardOptions {
  /**
   * 复制成功后念给读屏的句子。不传就不播报。
   * 只改按钮的 aria-label，读屏经常不念。
   */
  announce?: string
  /**
   * `isCopied` 保持为 true 的毫秒数。
   * @default 2000
   */
  resetAfterMs?: number
}

export interface UseClipboardReturn {
  /**
   * 把 `text` 写进剪贴板。成功时 `isCopied` 变为 true，并重新计时，返回 true。
   * 写入失败时状态不动，返回 false。
   */
  copy: (text: string) => Promise<boolean>
  /** 最近一次复制成功后的 `resetAfterMs` 内为 true。 */
  isCopied: Ref<boolean>
}

/**
 * 对应原版 Astryx 的 `hooks/useClipboard`。
 * `Code` 子路径和包的总入口还以 `useCopyToClipboard` 这个名字导出同一个函数。
 *
 * 连续复制会把倒计时重新算满，不会被上一次的定时器提前清掉。
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const resetAfterMs = options.resetAfterMs ?? DEFAULT_RESET_AFTER_MS
  const announceMessage = options.announce
  const announce = useAnnounce()
  const isCopied = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function clearResetTimer(): void {
    if (resetTimer != null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
    }
    catch {
      return false
    }

    isCopied.value = true
    if (announceMessage)
      announce(announceMessage)

    clearResetTimer()
    resetTimer = setTimeout(() => {
      resetTimer = null
      isCopied.value = false
    }, resetAfterMs)

    return true
  }

  onScopeDispose(clearResetTimer)

  return { copy, isCopied }
}

import type { MaybeRefOrGetter, Ref } from 'vue'
import { onScopeDispose, ref, toValue } from 'vue'
import { writeClipboardText } from './internal/clipboardWrite.js'
import { useAnnounce } from './useAnnounce.js'

const DEFAULT_RESET_AFTER_MS = 2000

export interface UseClipboardOptions {
  /**
   * 复制成功后念给读屏的句子。不传就不播报。
   * 只改按钮的 aria-label，读屏经常不念。
   */
  announce?: string
  /**
   * `isCopied` 和 `isFailed` 保持为 true 的毫秒数。
   * @default 2000
   */
  resetAfterMs?: number
  /**
   * 复制失败后念给读屏的句子，走更紧迫的 assertive 播报，因为失败是错误。不传就不播报。
   */
  announceFailure?: MaybeRefOrGetter<string | undefined>
  /** 剪贴板写入被拒绝时调用一次，参数是拒绝的原因。原因本身不会显示出来。 */
  onError?: (error: unknown) => void
}

export interface UseClipboardReturn {
  /**
   * 把 `text` 写进剪贴板。成功时 `isCopied` 变为 true，并重新计时，返回 true。
   * 所在框架不允许异步 Clipboard API、或浏览器拒绝写入时，在这次点击或按键里改用浏览器的复制命令。
   * 写入失败时 `isFailed` 变为 true 并重新计时，返回 false。
   */
  copy: (text: string) => Promise<boolean>
  /** 最近一次复制成功后的 `resetAfterMs` 内为 true。 */
  isCopied: Ref<boolean>
  /** 最近一次复制失败后的 `resetAfterMs` 内为 true。下一次复制开始时清掉。 */
  isFailed: Ref<boolean>
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
  const isFailed = ref(false)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function clearResetTimer(): void {
    if (resetTimer != null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  function armReset(): void {
    clearResetTimer()
    resetTimer = setTimeout(() => {
      resetTimer = null
      isCopied.value = false
      isFailed.value = false
    }, resetAfterMs)
  }

  async function copy(text: string): Promise<boolean> {
    try {
      await writeClipboardText(text)
    }
    catch (error) {
      isCopied.value = false
      isFailed.value = true
      const failure = toValue(options.announceFailure)
      if (failure)
        announce(failure, 'assertive')
      options.onError?.(error)
      armReset()
      return false
    }

    isFailed.value = false
    isCopied.value = true
    if (announceMessage)
      announce(announceMessage)
    armReset()

    return true
  }

  onScopeDispose(clearResetTimer)

  return { copy, isCopied, isFailed }
}

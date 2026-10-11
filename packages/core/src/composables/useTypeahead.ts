import { onScopeDispose, ref } from 'vue'

export interface UseTypeaheadOptions {
  /** 当前 DOM 顺序上的标签。某一项可以是 null，表示这个下标不能匹配。 */
  getItemLabels: () => ReadonlyArray<string | null | undefined>
  /** 匹配到之后聚焦或选中这一项。 */
  onMatch: (index: number) => void
  /** 从哪一项开始找。反复按同一个字母时，会从当前项的下一项接着走。 */
  getCurrentIndex?: () => number
  /**
   * 多久没有新按键就清空缓冲，单位毫秒。
   * @default 750
   */
  resetMs?: number
  /** 跳过这一项，例如禁用项。 */
  isDisabled?: (index: number) => boolean
}

export interface UseTypeaheadReturn {
  /** 吃掉了一个可打印字符时返回 true。 */
  onKeyDown: (event: KeyboardEvent) => boolean
  /** 清空还没超时的缓冲。 */
  reset: () => void
}

const DEFAULT_RESET_MS = 750

function isComposing(event: KeyboardEvent): boolean {
  return event.isComposing === true
}

/**
 * 对应原版 Astryx 的 `hooks/useTypeahead`。
 * 以前放在 DropdownMenu，名字是 `useMenuTypeahead`，旧名字仍可从原路径引用。
 *
 * 反复按同一个字母会在匹配项之间循环，而不是把查询收得更窄。
 * 空格留给激活；只有缓冲里已经有字时，空格才算查询的一部分。
 * 这个函数自己不移动焦点，调用方在 `onMatch` 里接 `useListFocus` 或其他集合。
 */
export function useTypeahead(options: UseTypeaheadOptions): UseTypeaheadReturn {
  const { getItemLabels, onMatch, getCurrentIndex, isDisabled, resetMs = DEFAULT_RESET_MS } = options

  const buffer = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  function reset(): void {
    buffer.value = ''
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function scheduleReset(): void {
    if (timer !== undefined)
      clearTimeout(timer)
    timer = setTimeout(reset, resetMs)
  }

  function onKeyDown(event: KeyboardEvent): boolean {
    const extendsQuery = event.key === ' ' && !event.ctrlKey && !event.metaKey && !isComposing(event) && buffer.value.length > 0
    const isPrintable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !isComposing(event) && event.key !== ' '

    if (!isPrintable && !extendsQuery)
      return false

    const labels = getItemLabels()
    if (labels.length === 0)
      return false

    const char = event.key.toLowerCase()
    const isRepeatSameChar = buffer.value.length > 0 && [...buffer.value].every(entry => entry === char)
    const next = isRepeatSameChar ? char : buffer.value + char
    buffer.value = next
    scheduleReset()

    const current = getCurrentIndex?.() ?? -1
    const count = labels.length
    const hasCurrent = current >= 0
    const start = hasCurrent ? current : 0
    // 单个字符从当前项的下一项开始，避免按一次字母还停在已经高亮的那一行。
    const offset = hasCurrent && next.length === 1 ? 1 : 0

    for (let i = 0; i < count; i++) {
      const index = (start + offset + i + count) % count
      if (isDisabled?.(index))
        continue
      const label = labels[index]
      if (label != null && label.trim().toLowerCase().startsWith(next)) {
        onMatch(index)
        return true
      }
    }
    return true
  }

  onScopeDispose(reset)

  return { onKeyDown, reset }
}

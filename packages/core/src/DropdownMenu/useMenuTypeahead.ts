import { onScopeDispose, ref } from 'vue'

export interface UseMenuTypeaheadOptions {
  /** The current in-DOM-order labels to match against. */
  getItemLabels: () => ReadonlyArray<string | null | undefined>
  /** Focus the matched row. */
  onMatch: (index: number) => void
  /** The row the search starts from, so repeated presses cycle through matches. */
  getCurrentIndex?: () => number
  /**
   * Milliseconds of inactivity after which the typed buffer resets.
   * @default 750
   */
  resetMs?: number
}

export interface MenuTypeahead {
  /** Returns `true` when a printable character was consumed. */
  onKeyDown: (event: KeyboardEvent) => boolean
  /** Clears the pending buffer. */
  reset: () => void
}

const DEFAULT_RESET_MS = 750

function isComposing(event: KeyboardEvent): boolean {
  return event.isComposing === true
}

/**
 * First-character ("type-ahead") search over a menu's rows.
 *
 * Pressing the same letter repeatedly cycles through the matching rows instead
 * of refining the query, so a menu with two rows starting with "d" can be
 * walked with "d", "d". Space is reserved for activation and only extends a
 * query that is already underway.
 */
export function useMenuTypeahead(options: UseMenuTypeaheadOptions): MenuTypeahead {
  const { getItemLabels, onMatch, getCurrentIndex, resetMs = DEFAULT_RESET_MS } = options

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
    const isRepeatSameChar = buffer.value.length > 0 && [...buffer.value].every(c => c === char)
    const next = isRepeatSameChar ? char : buffer.value + char
    buffer.value = next
    scheduleReset()

    const current = getCurrentIndex?.() ?? -1
    const count = labels.length
    const hasCurrent = current >= 0
    const start = hasCurrent ? current : 0
    // A single character starts after the current row, so pressing a letter
    // walks to the next row that begins with it rather than re-matching the
    // row already highlighted.
    const offset = hasCurrent && next.length === 1 ? 1 : 0

    for (let i = 0; i < count; i++) {
      const index = (start + offset + i + count) % count
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

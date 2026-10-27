const STORAGE_PREFIX = 'astryx-resizable:'

interface PersistedResizableState {
  size: number | null
  isCollapsed: boolean | null
}

export function loadPersistedState(key: string): PersistedResizableState | null {
  if (typeof window === 'undefined')
    return null
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw == null)
      return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'number' && Number.isFinite(parsed)) {
      return parsed === 0
        ? { size: null, isCollapsed: true }
        : { size: parsed, isCollapsed: null }
    }
    if (typeof parsed === 'object' && parsed != null) {
      const record = parsed as { size?: unknown, isCollapsed?: unknown }
      const hasSize = typeof record.size === 'number' && Number.isFinite(record.size) && record.size > 0
      if (hasSize || record.isCollapsed === true) {
        return {
          size: hasSize ? record.size as number : null,
          isCollapsed: record.isCollapsed === true,
        }
      }
    }
  }
  catch {
    return null
  }
  return null
}

export function savePersistedState(key: string, size: number, isCollapsed: boolean): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ size, isCollapsed }))
  }
  catch {
    /* 隐私模式或配额满了就跳过，尺寸仍然留在内存里。 */
  }
}

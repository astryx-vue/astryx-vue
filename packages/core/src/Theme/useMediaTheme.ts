import type { ComputedRef } from 'vue'
import { computed, inject } from 'vue'
import { mediaThemeKey } from './context.js'

export interface UseMediaThemeReturn {
  /** Resolved surface. `off` means the children keep the surrounding theme. */
  mode: ComputedRef<'dark' | 'light' | 'off'>
}

/** Read the nearest MediaTheme. Outside one, the mode is `off`. */
export function useMediaTheme(): UseMediaThemeReturn {
  const mode = inject(mediaThemeKey, null)
  return {
    mode: mode ?? computed(() => 'off' as const),
  }
}

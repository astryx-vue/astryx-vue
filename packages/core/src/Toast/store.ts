import type { ToastItem, ToastOptions } from './types.js'
import { markRaw, reactive } from 'vue'
import { resolveAutoHide, resolveAutoHideDuration } from './options.js'

let idCounter = 0

// Safety net for a toast that leaves without firing a transition, for example
// when the viewport is hidden or the exit transition is skipped. Comfortably
// longer than `--astryx-duration-fast-max` (165ms).
const EXIT_FALLBACK_MS = 400

export const toastStore = reactive<{
  toasts: ToastItem[]
  add: (options: ToastOptions) => string | null
  /**
   * Starts the exit for a toast and reports it through `onHide`. The dismiss
   * callbacks are not involved: those belong to dismissal from inside the
   * card, which goes through `dismissFromCard` first.
   */
  requestClose: (id: string, reason?: 'auto' | 'manual') => void
  /**
   * The path a toast takes when its own card dismisses it: the callback runs
   * before the exit, then the removal reports `onHide`.
   */
  dismissFromCard: (id: string, reason: 'auto' | 'manual') => void
  finalize: (id: string) => void
  clear: () => void
}>({
  toasts: [],
  add(options) {
    const endContent = options.endContent ? markRaw(options.endContent) : undefined
    const resolved = {
      type: options.type ?? 'info',
      body: options.body,
      isAutoHide: resolveAutoHide(options),
      autoHideDuration: resolveAutoHideDuration(options),
      endContent,
      onDismiss: options.onDismiss,
      onHide: options.onHide,
    }
    if (options.uniqueID) {
      const existing = this.toasts.find(toast => toast.uniqueID === options.uniqueID && !toast.isExiting)
      const behavior = options.collisionBehavior ?? 'overwrite'
      if (existing && behavior === 'ignore')
        return null
      if (existing) {
        Object.assign(existing, resolved)
        return existing.id
      }
    }
    const id = `astryx-toast-${++idCounter}`
    this.toasts.push({
      id,
      uniqueID: options.uniqueID,
      isExiting: false,
      ...resolved,
    })
    return id
  },
  requestClose(id, reason = 'manual') {
    const item = this.toasts.find(t => t.id === id)
    if (!item || item.isExiting)
      return
    item.isExiting = true
    item.onHide?.(reason)
    setTimeout(() => this.finalize(id), EXIT_FALLBACK_MS)
  },
  dismissFromCard(id, reason) {
    const item = this.toasts.find(t => t.id === id)
    if (!item || item.isExiting)
      return
    item.onDismiss?.(reason)
    this.requestClose(id, reason)
  },
  finalize(id) {
    const index = this.toasts.findIndex(t => t.id === id)
    if (index >= 0)
      this.toasts.splice(index, 1)
  },
  clear() {
    for (const id of this.toasts.map(t => t.id))
      this.requestClose(id)
  },
})

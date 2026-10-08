import type { ToastItem, ToastOptions } from './types.js'
import { reactive } from 'vue'

let idCounter = 0

// Safety net for a toast that leaves without firing a transition, for example
// when the viewport is hidden or the exit transition is skipped. Comfortably
// longer than `--astryx-duration-fast-max` (165ms).
const EXIT_FALLBACK_MS = 400

export const toastStore = reactive<{
  toasts: ToastItem[]
  add: (options: ToastOptions) => string
  requestClose: (id: string) => void
  finalize: (id: string) => void
  clear: () => void
}>({
  toasts: [],
  add(options) {
    const id = `astryx-toast-${++idCounter}`
    this.toasts.push({
      id,
      type: options.type ?? 'info',
      body: options.body,
      autoClose: options.autoClose ?? true,
      duration: options.duration ?? 5000,
      isExiting: false,
    })
    return id
  },
  requestClose(id) {
    const item = this.toasts.find(t => t.id === id)
    if (!item || item.isExiting)
      return
    item.isExiting = true
    setTimeout(() => this.finalize(id), EXIT_FALLBACK_MS)
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

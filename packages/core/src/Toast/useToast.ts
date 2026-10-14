import type { ToastOptions } from './types.js'
import { toastStore } from './store.js'

export interface UseToastReturn {
  /**
   * Show a new toast. Returns a function that dismisses it.
   */
  (options: ToastOptions): () => void
  /**
   * Dismiss a toast by id.
   */
  dismiss: (id: string) => void
  /**
   * Dismiss all toasts.
   */
  clear: () => void
}

export function useToast(): UseToastReturn {
  function show(options: ToastOptions): () => void {
    const id = toastStore.add(options)
    if (id == null)
      return () => {}
    return () => toastStore.requestClose(id)
  }

  show.dismiss = (id: string) => toastStore.requestClose(id)
  show.clear = () => toastStore.clear()

  return show
}

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  /**
   * Visual type of the toast.
   * @default 'info'
   */
  type?: ToastType
  /**
   * Message body text.
   */
  body: string
  /**
   * Whether the toast should auto-dismiss.
   * @default true
   */
  autoClose?: boolean
  /**
   * Auto-dismiss duration in milliseconds.
   * @default 5000
   */
  duration?: number
}

export interface ToastItem extends Required<ToastOptions> {
  id: string
  /**
   * True once the toast has been asked to close. The toast stays mounted so it
   * can play its exit transition, then leaves the store.
   */
  isExiting: boolean
}

export type ToastPlacement = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'

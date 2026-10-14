import type { Component } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

/**
 * What happens when a new toast reuses a `uniqueID` that is already on screen.
 *
 * `overwrite` replaces that toast in place. `ignore` drops the new toast.
 */
export type ToastCollisionBehavior = 'ignore' | 'overwrite'

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
  /**
   * Identity shared by toasts that should collapse into one. A later toast with
   * the same id overwrites the visible one, unless `collisionBehavior` is
   * `ignore`.
   */
  uniqueID?: string
  /**
   * How a `uniqueID` clash is resolved.
   * @default 'overwrite'
   */
  collisionBehavior?: ToastCollisionBehavior
  /**
   * Trailing action rendered after the message, such as an undo button.
   * Pass a component; for a one-off render, pass a function component.
   */
  endContent?: Component
}

export interface ToastItem {
  id: string
  type: ToastType
  body: string
  autoClose: boolean
  duration: number
  uniqueID?: string
  endContent?: Component
  /**
   * True once the toast has been asked to close. The toast stays mounted so it
   * can play its exit transition, then leaves the store.
   */
  isExiting: boolean
}

export type ToastPlacement = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'

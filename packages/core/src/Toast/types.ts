import type { Component, VNode } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

/** 提示消失的原因：`auto` 是计时器关的，`manual` 是人或代码关的。 */
export type ToastDismissReason = 'auto' | 'manual'

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
   * Whether the toast dismisses itself. Defaults to true, except for
   * `error`, which stays until it is dismissed.
   */
  isAutoHide?: boolean
  /**
   * Auto-dismiss duration in milliseconds.
   * @default 5000
   */
  autoHideDuration?: number
  /**
   * Older name of `isAutoHide`. Both work; `isAutoHide` wins.
   */
  autoClose?: boolean
  /**
   * Older name of `autoHideDuration`. Both work; `autoHideDuration` wins.
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
  /**
   * Runs when this toast is dismissed from inside the card: the timer or the
   * close button.
   */
  onDismiss?: (reason: ToastDismissReason) => void
  /**
   * Runs when this toast is removed, however it was dismissed, including the
   * programmatic dismiss returned by `useToast()`.
   */
  onHide?: (reason: ToastDismissReason) => void
}

export interface ToastItem {
  id: string
  type: ToastType
  body: string
  isAutoHide: boolean
  autoHideDuration: number
  uniqueID?: string
  endContent?: Component
  onDismiss?: (reason: ToastDismissReason) => void
  onHide?: (reason: ToastDismissReason) => void
  /**
   * True once the toast has been asked to close. The toast stays mounted so it
   * can play its exit transition, then leaves the store.
   */
  isExiting: boolean
}

/** 传给 `content` 插槽的值。 */
export interface ToastContentScope {
  /** 提示正文，和 `body` 属性一致。 */
  body: string
  /** 末尾内容，和 `endContent` 属性一致。 */
  endContent?: Component
  /** 提示类型。 */
  type: ToastType
  /** 这条提示会不会自动消失。 */
  isAutoHide: boolean
  /** 自动消失的时长，单位毫秒。 */
  autoHideDuration: number
  /** 关掉这条提示。 */
  dismiss: () => void
}

export type ToastPlacement = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface ToastSlots {
  /** 替换正文文字。 */
  default?: () => VNode[]
  /** 末尾内容，替代 `endContent` 属性。 */
  end?: () => VNode[]
  /** 替换整块卡片内容，带 `ToastContentScope` 参数；这时不再渲染自带的关闭按钮。 */
  content?: (scope: ToastContentScope) => VNode[]
}

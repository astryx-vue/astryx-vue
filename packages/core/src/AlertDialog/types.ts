import type { VNodeChild } from 'vue'
import type { ButtonVariant } from '../Button/types.js'

/** Visual style of the confirming action. Mirrors the `Button` variants. */
export type AlertDialogActionVariant = ButtonVariant

/** Where the confirm action sits relative to the least destructive choice. */
export type AlertDialogLayout = 'row' | 'stacked'

export interface AlertDialogProps {
  /**
   * Whether the dialog is open. The dialog never closes itself: the parent
   * receives `openChange` and decides what to do with it.
   */
  isOpen: boolean
  /**
   * Renders the surface in normal flow without the modal dialog, the backdrop,
   * or any focus behavior, for documentation previews. The inline path is not a
   * modal, so it exposes `role="group"` instead of `role="alertdialog"`.
   * @default false
   */
  isInline?: boolean
  /** The question being asked. It names the dialog through `aria-labelledby`. */
  title: string
  /**
   * What happens if the user confirms. It is linked to the dialog through
   * `aria-describedby`, so the consequence is announced with the dialog.
   */
  description: string
  /**
   * Label for the cancel button, rendered as a ghost button. Clicking it asks
   * the parent to close the dialog.
   * @default 'Cancel'
   */
  cancelLabel?: string
  /** Label for the confirming action. Say what will happen: "Delete project". */
  actionLabel: string
  /**
   * Visual style of the confirming action. The destructive variant is the
   * default because the dialog exists to confirm irreversible work.
   * @default 'destructive'
   */
  actionVariant?: AlertDialogActionVariant
  /**
   * Shows a spinner on the confirming action while its work is in flight, so the
   * dialog can stay open until the action settles.
   * @default false
   */
  isActionLoading?: boolean
  /**
   * Preferred width. Numbers are pixels, strings are used as-is. Dialog clamps
   * it to the container and the dynamic viewport.
   * @default 400
   */
  width?: number | string
}

export interface AlertDialogEmits {
  /**
   * Emitted with `false` when the user cancels: the cancel button or Escape.
   * The dialog does not close on its own, so the parent decides whether to
   * follow the request. Clicking the backdrop and clicking the confirm action
   * never emit this.
   */
  openChange: [isOpen: boolean]
  /**
   * Emitted when the confirming action is activated. The dialog stays open, so
   * hold it with `isActionLoading` and close it through `isOpen` when the work
   * settles.
   */
  action: [event: MouseEvent]
}

export interface AlertDialogSlots {
  /** Rich content for the title. Replaces the `title` prop. */
  title?: () => VNodeChild
  /** Rich content for the description. Replaces the `description` prop. */
  description?: () => VNodeChild
  /**
   * Extra content in the footer, before the cancel and confirm buttons. Use it
   * for a secondary path such as a link to the documentation.
   */
  actions?: () => VNodeChild
}

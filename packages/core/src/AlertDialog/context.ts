import type { InjectionKey, Ref } from 'vue'

/**
 * Values the title, description, and actions slots can read. The ids let slot
 * content that renders its own markup keep the associations the dialog already
 * announces, and `isSmallScreen` reports the layout the footer is using.
 */
export interface AlertDialogContext {
  /** Id of the element that names the dialog. */
  titleId: string
  /** Id of the element that describes the dialog. */
  descriptionId: string
  /** Whether the footer stacks the actions instead of laying them out in a row. */
  isSmallScreen: Ref<boolean>
}

export const ALERT_DIALOG_CONTEXT_KEY: InjectionKey<AlertDialogContext> = Symbol('astryx-alert-dialog')

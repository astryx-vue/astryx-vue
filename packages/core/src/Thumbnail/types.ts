export type ThumbnailRemoveVisibility = 'always' | 'hover'

export interface ThumbnailProps {
  src?: string
  alt?: string
  /** Accessible name. Not drawn; used by the tooltip and the remove button. */
  label?: string
  isLoading?: boolean
  isDisabled?: boolean
  /**
   * When the remove button is visible. `hover` also reveals it on keyboard
   * focus, and keeps it visible for coarse pointers.
   * @default 'hover'
   */
  showRemoveOn?: ThumbnailRemoveVisibility
}

export interface ThumbnailEmits {
  remove: [event: MouseEvent]
  click: [event: MouseEvent]
}

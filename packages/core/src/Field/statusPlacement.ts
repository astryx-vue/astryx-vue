export type StatusPlacement = 'attached' | 'detached' | 'tooltip'

/**
 * Ghost selectors detach an attached status message so the toolbar stays one line.
 * Tooltip and an explicit detached placement stay as given.
 */
export function fieldStatusPlacement(variant: string | undefined, statusVariant: StatusPlacement): StatusPlacement {
  return variant === 'ghost' && statusVariant === 'attached' ? 'detached' : statusVariant
}

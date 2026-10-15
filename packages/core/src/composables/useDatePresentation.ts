import type { NativePicker } from './useTimeValue.js'

/** Which surface collects a date. The text-only option belongs to the time field. */
export type DatePresentation = 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'

export type DateSurface = 'popover' | 'sheet' | 'native'

/**
 * `presentation` wins over the older native picker name.
 * With neither set, a mouse gets the calendar popover and a coarse pointer gets the system date control.
 */
export function resolveDatePresentation(presentation: DatePresentation | undefined, nativePicker: NativePicker | undefined): DatePresentation {
  if (presentation)
    return presentation
  if (nativePicker === 'always')
    return 'native'
  if (nativePicker === 'never')
    return 'adaptive-bottom-sheet'
  if (nativePicker === 'touch')
    return 'adaptive-native'
  return 'adaptive-native'
}

export function resolveDateSurface(presentation: DatePresentation, coarse: boolean): DateSurface {
  if (presentation === 'popover')
    return 'popover'
  if (presentation === 'bottom-sheet')
    return 'sheet'
  if (presentation === 'native')
    return 'native'
  if (presentation === 'adaptive-bottom-sheet')
    return coarse ? 'sheet' : 'popover'
  return coarse ? 'native' : 'popover'
}

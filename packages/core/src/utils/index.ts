// 自己掌管滚动位置的组件（例如 lab 的 ChatVirtualizer）和 core 共用的滚动协作工具：
// 浏览器滚动锚定的唯一开关，以及手指滚动的判断。
export { setScrollAnchoringOff } from '../composables/internal/scrollAnchoring.js'
export { useFingerScroll } from '../gestures/useFingerScroll.js'
export type { UseFingerScrollOptions } from '../gestures/useFingerScroll.js'

export { chainEventHandlers } from './chainEventHandlers.js'
export { characterCount, firstCharacter, truncateCharacters } from './characters.js'

export { dateToISO, isLocaleDayFirst, parseDateInput, parseISO } from './dateParser.js'

export type { DayOfWeek, DayOfWeekName, ISODateString, PlainDate } from './dateTypes.js'
export { normalizeDayOfWeek } from './dateTypes.js'

export { getItemGroup, groupItems } from './groupItems.js'

export type { GroupableItem, GroupItemsOptions, ItemGroup } from './groupItems.js'

export { getInputARIA, joinAriaIDs } from './inputAria.js'
export type { InputARIA, InputARIAInputGroup } from './inputAria.js'

export {
  DEFAULT_INPUT_PRESENTATION,
  effectiveInputPresentation,
  effectivePickerPresentation,
  pickerPresentationFromNativePicker,
  presentationFromNativePicker,
  resolveInputPresentation,
  resolvePickerPresentation,
} from './inputPresentation.js'

export type {
  InputPresentation,
  InputPresentationSurface,
  LegacyNativePicker,
  PickerPresentation,
  PickerPresentationSurface,
} from './inputPresentation.js'
export { scrollEventTarget, scrollportTop, scrollsPage } from './pageScroller.js'
export { parseStyleKey } from './parseStyleKey.js'

export {
  DATE_FORMAT_LONG,
  DATE_FORMAT_MONTH_ONLY,
  DATE_FORMAT_MONTH_YEAR,
  DATE_FORMAT_SHORT,
  DATE_FORMAT_SHORT_WITH_WEEKDAY,
  DATE_FORMAT_SHORT_WITH_YEAR,
  DATE_FORMAT_WEEKDAY_ONLY,
  DATE_FORMAT_WITH_WEEKDAY,
  formatSharedDate,
  getDaysInMonth,
  getTimeZoneParts,
  plainDateAddDays,
  plainDateAddMonths,
  plainDateCreate,
  plainDateDayOfWeek,
  plainDateDiffDays,
  plainDateFormat,
  plainDateFromDate,
  plainDateFromInstant,
  plainDateFromISO,
  plainDateGetWeekNumber,
  plainDateIsAfter,
  plainDateIsBefore,
  plainDateIsEqual,
  plainDateIsInRange,
  plainDateMax,
  plainDateMin,
  plainDateSetEndOfWeekExclusive,
  plainDateSetFirstOfMonth,
  plainDateSetStartOfWeek,
  plainDateToDate,
  plainDateToday,
  plainDateToInstant,
  plainDateToISO,
  plainDateWeekFieldName,
  SHARED_DATE_FORMAT_OPTIONS,
} from './plainDate.js'
export type { SharedDateFormat } from './plainDate.js'

export { isSafeDestination, isSafeUrl, sanitizeUrl } from './safeUrl.js'

export { observeResize, unobserveResize } from './sharedResizeObserver.js'

export {
  adjustTime,
  clampTime,
  compareTime,
  createISOTimeString,
  formatDisplayTime12h,
  formatDisplayTime24h,
  parseTimeInput,
} from './timeParser.js'

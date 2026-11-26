import type { ComputedRef } from 'vue'
import type { DatePresentation } from '../composables/useDatePresentation.js'
import type { NativePicker } from '../composables/useTimeValue.js'
import type { DateInputMessages } from '../locale/messages/date-input.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import { computed, watch } from 'vue'
import { resolveDatePresentation } from '../composables/useDatePresentation.js'
import { useCalendarSystem, warnCalendarOnce } from '../locale/calendar.js'
import { formatCalendarDateHint } from '../utils/calendarDateText.js'
import { calendarDisplayName } from '../utils/calendarFormat.js'
import { isGregorianCalendar } from '../utils/calendarSystem.js'
import { calendarPickerPresentation } from '../utils/inputPresentation.js'
import { plainDateFromDate } from '../utils/plainDate.js'
import { isOutsideBounds } from './dateEntry.js'

export interface CalendarPresentationOptions {
  /** 警告里的组件名。 */
  source: string
  calendar: () => CalendarSystem | undefined
  presentation: () => DatePresentation | undefined
  nativePicker?: () => NativePicker | undefined
}

export interface CalendarPresentation {
  /** 字段显示的历法。 */
  calendar: ComputedRef<CalendarSystem>
  /** 打开方式。系统日期控件只显示公历，别的历法里换成 Astryx 自己的弹出层或底部面板。 */
  presentation: ComputedRef<DatePresentation>
}

/** 日期字段的历法，以及这种历法允许的打开方式。显式传了 `native` 却用不上时开发期警告一次。 */
export function useCalendarPresentation(options: CalendarPresentationOptions): CalendarPresentation {
  const calendar = useCalendarSystem(options.calendar, options.source)
  const isNativeCalendar = computed(() => isGregorianCalendar(calendar.value))
  watch(() => options.presentation() === 'native' && !isNativeCalendar.value, (overridden) => {
    if (!overridden)
      return
    warnCalendarOnce(
      `presentation-native-calendar:${options.source}:${calendar.value}`,
      options.source,
      `presentation="native" shows the Astryx picker in the "${calendar.value}" calendar, because the native date control `
      + 'shows only Gregorian dates: the popover on a fine pointer and the bottom sheet on a coarse pointer.',
    )
  }, { immediate: true })
  return {
    calendar,
    presentation: computed(() => calendarPickerPresentation(
      resolveDatePresentation(options.presentation(), options.nativePicker?.()),
      isNativeCalendar.value,
    )),
  }
}

export interface CalendarFieldTextOptions {
  calendar: ComputedRef<CalendarSystem>
  locale: () => string
  messages: () => DateInputMessages
  min: () => Date | undefined
  max: () => Date | undefined
  isBlocked: (date: Date) => boolean
}

export interface CalendarFieldText {
  /** 非公历字段聚焦且为空时的占位提示，例如 "e.g., ۱۴۰۵/۸/۸"；公历时是 null。只在浏览器里读今天。 */
  formatHint: () => string | null
  /** 字段的历法和应用的历法不同时只给读屏的说明，相同时是 null。 */
  calendarDescription: ComputedRef<string | null>
}

/** 今天；字段不收今天时取离今天最近的能选的日子。一年内都找不到时取收进范围的今天。 */
function nearestAcceptedDate(today: Date, options: CalendarFieldTextOptions): Date {
  const min = options.min()
  const max = options.max()
  let start = today
  if (min != null && isOutsideBounds(start, { min }))
    start = new Date(min.getFullYear(), min.getMonth(), min.getDate())
  if (max != null && isOutsideBounds(start, { max }))
    start = new Date(max.getFullYear(), max.getMonth(), max.getDate())
  for (let offset = 0; offset <= 366; offset += 1) {
    for (const sign of offset === 0 ? [1] : [1, -1]) {
      const candidate = new Date(start.getFullYear(), start.getMonth(), start.getDate() + sign * offset)
      if (!isOutsideBounds(candidate, { min, max }) && !options.isBlocked(candidate))
        return candidate
    }
  }
  return start
}

/** 日期字段按历法补充的文字：格式提示和读屏说明。 */
export function useCalendarFieldText(options: CalendarFieldTextOptions): CalendarFieldText {
  const providerCalendar = useCalendarSystem()
  const isProviderCalendar = computed(() => isGregorianCalendar(options.calendar.value)
    ? isGregorianCalendar(providerCalendar.value)
    : options.calendar.value === providerCalendar.value)
  return {
    formatHint: () => {
      if (isGregorianCalendar(options.calendar.value))
        return null
      const now = new Date()
      const example = nearestAcceptedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()), options)
      return options.messages().formatHint(formatCalendarDateHint(plainDateFromDate(example), options.locale(), options.calendar.value))
    },
    calendarDescription: computed(() => isProviderCalendar.value
      ? null
      : options.messages().calendarDescription(calendarDisplayName(options.calendar.value, options.locale()))),
  }
}

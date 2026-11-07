import type { InjectionKey } from 'vue'
import type {
  CalendarEvent,
  ScheduleCategory,
  ScheduleHeadingLevel,
  SchedulePlugin,
  ScheduleRange,
  ScheduleViewBase,
  ZonedDateTime,
} from './types.js'
import { inject } from 'vue'

export interface ScheduleContextValue {
  events: ReadonlyArray<CalendarEvent>
  categories: ReadonlyArray<ScheduleCategory>
  date: ZonedDateTime
  focusDate: ZonedDateTime
  timezoneID: string
  locale: string
  range: ScheduleRange
  isLoading: boolean
  onPreviousDate: () => void
  previousDateLabel: string
  onToday: () => void
  onNextDate: () => void
  nextDateLabel: string
  view: ScheduleViewBase
  plugins: ReadonlyArray<SchedulePlugin>
  headingLevel: ScheduleHeadingLevel
}

export const ScheduleContext: InjectionKey<ScheduleContextValue> = Symbol('ScheduleContext')

export function useScheduleContext(): ScheduleContextValue {
  const context = inject(ScheduleContext, null)
  if (context == null)
    throw new Error('Schedule views must be rendered inside Schedule.')
  return context
}

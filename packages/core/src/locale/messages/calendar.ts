import type { AstryxLocale } from '../types.js'

export interface CalendarMessages {
  label: string
  previousMonth: string
  nextMonth: string
}

export const calendarMessages: Record<AstryxLocale, CalendarMessages> = {
  'en': {
    label: 'Calendar',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
  'zh-CN': {
    label: '日历',
    previousMonth: '上一月',
    nextMonth: '下一月',
  },
}

import type { AstryxLocale } from '../types.js'

export interface CalendarMessages {
  label: string
  previousMonth: string
  nextMonth: string
  rangeStart: (date: string) => string
  rangeCleared: (date: string) => string
  rangeComplete: (start: string, end: string) => string
  rangeStartName: (date: string) => string
  rangeEndName: (date: string) => string
  rangeBoth: (date: string) => string
}

export const calendarMessages: Record<AstryxLocale, CalendarMessages> = {
  'en': {
    label: 'Calendar',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    rangeStart: date => `Range start, ${date}`,
    rangeCleared: date => `Range cleared, ${date}`,
    rangeComplete: (start, end) => `${start} to ${end}`,
    rangeStartName: date => `${date}, range start`,
    rangeEndName: date => `${date}, range end`,
    rangeBoth: date => `${date}, range start and range end`,
  },
  'zh-CN': {
    label: '日历',
    previousMonth: '上一月',
    nextMonth: '下一月',
    rangeStart: date => `已选择开始日期，${date}`,
    rangeCleared: date => `已取消选择，${date}`,
    rangeComplete: (start, end) => `${start}到${end}`,
    rangeStartName: date => `${date}，范围开始`,
    rangeEndName: date => `${date}，范围结束`,
    rangeBoth: date => `${date}，范围开始和结束`,
  },
}

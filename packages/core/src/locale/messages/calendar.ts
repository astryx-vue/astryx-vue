import type { AstryxLocale } from '../types.js'

export interface CalendarMessages {
  label: string
  previousMonth: string
  nextMonth: string
  /** 区间模式选完开始日期后的播报，提示接着选结束日期。 */
  rangeStart: (date: string) => string
  /** 开始日期被取消后的播报，提示重新选开始日期。 */
  rangeCleared: (date: string) => string
  /** 区间选完后的播报。 */
  rangeComplete: (start: string, end: string) => string
  rangeStartName: (date: string) => string
  rangeEndName: (date: string) => string
  rangeBoth: (date: string) => string
  /** 单选模式下，已选中那一天的无障碍名。 */
  daySelected: (date: string) => string
  /** 区间里（不含两端）某一天的无障碍名。 */
  dayInRange: (date: string) => string
}

export const calendarMessages: Record<AstryxLocale, CalendarMessages> = {
  'en': {
    label: 'Calendar',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    rangeStart: date => `Start date ${date}. Select an end date.`,
    rangeCleared: date => `Cleared start date ${date}. Select a start date.`,
    rangeComplete: (start, end) => `Selected range: ${start} to ${end}.`,
    rangeStartName: date => `${date}, range start`,
    rangeEndName: date => `${date}, range end`,
    rangeBoth: date => `${date}, range start and range end`,
    daySelected: date => `${date}, selected`,
    dayInRange: date => `${date}, in range`,
  },
  'zh-CN': {
    label: '日历',
    previousMonth: '上个月',
    nextMonth: '下个月',
    rangeStart: date => `开始日期：${date}。请选择结束日期。`,
    rangeCleared: date => `已取消开始日期 ${date}。请重新选择开始日期。`,
    rangeComplete: (start, end) => `已选择 ${start} 至 ${end}。`,
    rangeStartName: date => `${date}，开始日期`,
    rangeEndName: date => `${date}，结束日期`,
    rangeBoth: date => `${date}，开始和结束日期`,
    daySelected: date => `${date}，已选中`,
    dayInRange: date => `${date}，在所选范围内`,
  },
}

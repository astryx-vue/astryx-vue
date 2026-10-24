import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateTimeInputMessages {
  /** 触屏面板顶部「日期」分段。 */
  dateLabel: string
  /** 触屏面板顶部「时间」分段。 */
  timeLabel: string
  clear: (label?: string) => string
  placeholder: string
  /** 时间那一格没填时的占位文字。 */
  timePlaceholder: string
  /** 日期时间选择器弹层的无障碍名。 */
  dialogLabel: string
  /** 时间那一格的无障碍名，例如「开始日期 时间」。 */
  timeSuffix: (label: string) => string
  /** 预设时间下拉列表的无障碍名。 */
  timeOptionsLabel: (label: string) => string
  /** 触屏面板顶部日期 / 时间分段控件的无障碍名。 */
  pickerMode: string
  /** 触屏时间段旁边时钟按钮的名字。 */
  openTimePicker: (label: string) => string
  /** 触屏面板日期页的主按钮：确认日期，进到时间页。 */
  saveDatePicking: string
  hourWheel: string
  minuteWheel: string
  secondWheel: string
  meridiemWheel: string
  meridiemAM: string
  meridiemPM: string
}

export const dateTimeInputMessages: Record<AstryxLocale, DateTimeInputMessages> = {
  'en': {
    dateLabel: 'Date',
    timeLabel: 'Time',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    placeholder: 'Select a date',
    timePlaceholder: 'Select a time',
    dialogLabel: 'Choose date and time',
    timeSuffix: label => `${label} time`,
    timeOptionsLabel: label => `${label} options`,
    pickerMode: 'Date/time section',
    openTimePicker: label => `Open ${label}`,
    saveDatePicking: 'Save date',
    hourWheel: 'Hour',
    minuteWheel: 'Minute',
    secondWheel: 'Second',
    meridiemWheel: 'AM/PM',
    meridiemAM: 'AM',
    meridiemPM: 'PM',
  },
  'zh-CN': {
    dateLabel: '日期',
    timeLabel: '时间',
    clear: label => clearLabel(label, '清除', '清除'),
    placeholder: '选择日期',
    timePlaceholder: '选择时间',
    dialogLabel: '选择日期和时间',
    timeSuffix: label => `${label}的时间`,
    timeOptionsLabel: label => `${label}选项`,
    pickerMode: '切换日期或时间',
    openTimePicker: label => `打开${label}`,
    saveDatePicking: '确定日期',
    hourWheel: '小时',
    minuteWheel: '分钟',
    secondWheel: '秒',
    meridiemWheel: '上午/下午',
    meridiemAM: '上午',
    meridiemPM: '下午',
  },
}

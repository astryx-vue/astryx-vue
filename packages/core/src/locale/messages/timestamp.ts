import type { AstryxLocale } from '../types.js'

export interface TimestampMessages {
  copyValue: (value: string) => string
  copy: string
  copied: string
  copyFailed: string
  detailsLabel: string
  /** 相对时间的无障碍名：先是屏幕上显示的词，再是完整日期。显示的词必须在最前面。 */
  relativeLabel: (relative: string, date: string) => string
}

export const timestampMessages: Record<AstryxLocale, TimestampMessages> = {
  'en': {
    copyValue: value => `Copy ${value}`,
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy value to clipboard.',
    detailsLabel: 'Timestamp details',
    relativeLabel: (relative, date) => `${relative}, ${date}`,
  },
  'zh-CN': {
    copyValue: value => `复制 ${value}`,
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败',
    detailsLabel: '时间戳详情',
    relativeLabel: (relative, date) => `${relative}，${date}`,
  },
}

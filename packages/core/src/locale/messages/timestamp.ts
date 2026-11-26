import type { AstryxLocale } from '../types.js'

export interface TimestampMessages {
  copyValue: (value: string) => string
  copy: string
  copied: string
  copyFailed: string
  detailsLabel: string
}

export const timestampMessages: Record<AstryxLocale, TimestampMessages> = {
  'en': {
    copyValue: value => `Copy ${value}`,
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy value to clipboard.',
    detailsLabel: 'Timestamp details',
  },
  'zh-CN': {
    copyValue: value => `复制 ${value}`,
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败',
    detailsLabel: '时间戳详情',
  },
}

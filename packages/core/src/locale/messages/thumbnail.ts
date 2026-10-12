import type { AstryxLocale } from '../types.js'

export interface ThumbnailMessages {
  remove: (accessibleName: string) => string
  open: (accessibleName: string) => string
  fallbackName: string
}

export const thumbnailMessages: Record<AstryxLocale, ThumbnailMessages> = {
  'en': {
    remove: accessibleName => `Remove ${accessibleName}`,
    open: accessibleName => `Open ${accessibleName}`,
    fallbackName: 'Thumbnail',
  },
  'zh-CN': {
    remove: accessibleName => `移除 ${accessibleName}`,
    open: accessibleName => `打开 ${accessibleName}`,
    fallbackName: '缩略图',
  },
}

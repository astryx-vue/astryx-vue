import type { AstryxLocale } from '../types.js'

export interface MetadataListMessages {
  showMore: string
  showLess: string
}

export const metadataListMessages: Record<AstryxLocale, MetadataListMessages> = {
  'en': {
    showMore: 'Show more',
    showLess: 'Show less',
  },
  'zh-CN': {
    showMore: '显示更多',
    showLess: '收起',
  },
}

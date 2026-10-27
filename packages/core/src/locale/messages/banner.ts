import type { AstryxLocale } from '../types.js'

export interface BannerMessages {
  /** 关闭按钮的提示文字；标题不是纯文本时也当无障碍名。 */
  dismiss: string
  /** 关闭按钮的无障碍名，带上横幅标题，叠在一起的横幅才分得清。 */
  dismissTitled: (dismiss: string, title: string) => string
  /** 展开时，折叠按钮的名字和提示。 */
  collapse: string
  /** 折叠时，展开按钮的名字和提示。 */
  expand: string
}

export const bannerMessages: Record<AstryxLocale, BannerMessages> = {
  'en': {
    dismiss: 'Dismiss',
    dismissTitled: (dismiss, title) => `${dismiss} ${title}`,
    collapse: 'Collapse',
    expand: 'Expand',
  },
  'zh-CN': {
    dismiss: '关闭',
    dismissTitled: (dismiss, title) => `${dismiss}“${title}”`,
    collapse: '收起',
    expand: '展开',
  },
}

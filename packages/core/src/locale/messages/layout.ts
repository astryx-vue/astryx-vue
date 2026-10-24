import type { AstryxLocale } from '../types.js'

export interface LayoutMessages {
  skipToContent: string
  resizeHandle: string
  collapsed: string
  mobileNavigation: string
}

export const layoutMessages: Record<AstryxLocale, LayoutMessages> = {
  'en': {
    skipToContent: 'Skip to content',
    resizeHandle: 'Resize handle',
    collapsed: 'Collapsed',
    mobileNavigation: 'Mobile navigation',
  },
  'zh-CN': {
    skipToContent: '跳到正文',
    resizeHandle: '拖拽分隔条',
    collapsed: '已收起',
    mobileNavigation: '移动端导航',
  },
}

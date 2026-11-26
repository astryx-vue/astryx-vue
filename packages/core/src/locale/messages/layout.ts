import type { AstryxLocale } from '../types.js'

export interface LayoutMessages {
  skipToContent: string
  resizeHandle: string
  collapsed: string
  mobileNavigation: string
  scrollRegion: string
}

export const layoutMessages: Record<AstryxLocale, LayoutMessages> = {
  'en': {
    skipToContent: 'Skip to content',
    resizeHandle: 'Resize handle',
    collapsed: 'Collapsed',
    mobileNavigation: 'Mobile navigation',
    scrollRegion: 'Content',
  },
  'zh-CN': {
    skipToContent: '跳到正文',
    resizeHandle: '拖拽分隔条',
    collapsed: '已收起',
    mobileNavigation: '移动端导航',
    scrollRegion: '内容',
  },
}

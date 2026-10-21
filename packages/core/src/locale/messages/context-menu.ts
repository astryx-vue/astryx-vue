import type { AstryxLocale } from '../types.js'

export interface ContextMenuMessages {
  /** 右键或长按弹出的菜单的默认无障碍名。 */
  label: string
}

export const contextMenuMessages: Record<AstryxLocale, ContextMenuMessages> = {
  'en': { label: 'Context menu' },
  'zh-CN': { label: '快捷菜单' },
}

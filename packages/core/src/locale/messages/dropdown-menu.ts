import type { AstryxLocale } from '../types.js'

export interface DropdownMenuMessages {
  /** 下拉菜单弹层的默认无障碍名。 */
  label: string
  back: string
  backTo: (parent: string) => string
}

export const dropdownMenuMessages: Record<AstryxLocale, DropdownMenuMessages> = {
  'en': {
    label: 'Menu',
    back: 'Back',
    backTo: parent => `Back to ${parent}`,
  },
  'zh-CN': {
    label: '菜单',
    back: '返回',
    backTo: parent => `返回到${parent}`,
  },
}

import type { AstryxLocale } from '../types.js'

export interface DropdownMenuMessages {
  back: string
  backTo: (parent: string) => string
}

export const dropdownMenuMessages: Record<AstryxLocale, DropdownMenuMessages> = {
  'en': {
    back: 'Back',
    backTo: parent => `Back to ${parent}`,
  },
  'zh-CN': {
    back: '返回',
    backTo: parent => `返回到${parent}`,
  },
}

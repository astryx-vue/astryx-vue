import type { AstryxLocale } from '../types.js'

export interface TreeListMessages {
  toggleChildren: string
}

export const treeListMessages: Record<AstryxLocale, TreeListMessages> = {
  'en': {
    toggleChildren: 'Toggle children',
  },
  'zh-CN': {
    toggleChildren: '切换子项',
  },
}

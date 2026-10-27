import type { AstryxLocale } from '../types.js'

export interface AlertDialogMessages {
  /** 次要按钮的默认文字，点了关闭确认框。 */
  cancel: string
}

export const alertDialogMessages: Record<AstryxLocale, AlertDialogMessages> = {
  'en': { cancel: 'Cancel' },
  'zh-CN': { cancel: '取消' },
}

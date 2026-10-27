import type { AstryxLocale } from '../types.js'

export interface ToastMessages {
  /** 通知右上角关闭按钮的无障碍名。 */
  dismiss: string
  /** 放通知的那块区域的无障碍名。 */
  viewport: string
}

export const toastMessages: Record<AstryxLocale, ToastMessages> = {
  'en': {
    dismiss: 'Dismiss notification',
    viewport: 'Notifications',
  },
  'zh-CN': {
    dismiss: '关闭通知',
    viewport: '通知',
  },
}

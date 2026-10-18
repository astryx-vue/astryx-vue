import type { ToastOptions } from './types.js'

/** 这条提示会不会自己消失。`error` 默认不消失。 */
export function resolveAutoHide(options: ToastOptions): boolean {
  return options.isAutoHide ?? options.autoClose ?? options.type !== 'error'
}

/** 自动消失的时长，单位毫秒。 */
export function resolveAutoHideDuration(options: ToastOptions): number {
  return options.autoHideDuration ?? options.duration ?? 5000
}

import type { ComputedRef, InjectionKey } from 'vue'

export interface DialogContext {
  /** 标题元素的 id，同时作为对话框的默认无障碍名称。 */
  titleId: string
  isInline: ComputedRef<boolean>
  /** 标题挂载时注册为 true，卸载时注册为 false。 */
  registerTitle: (isMounted: boolean) => void
}

export const DIALOG_CONTEXT_KEY: InjectionKey<DialogContext> = Symbol('astryx-dialog')

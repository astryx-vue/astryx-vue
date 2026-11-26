import type { DialogContext } from './context.js'
import { inject } from 'vue'
import { DIALOG_CONTEXT_KEY } from './context.js'

/**
 * 读最近的 Dialog 给标题的约定：标题 id、是否内联，以及标题挂载、卸载时的登记。
 * 不在 Dialog 里时是 null。给自己画对话框页头的组件用，比如实验包的 DialogHeroHeader。
 */
export function useDialogContext(): DialogContext | null {
  return inject(DIALOG_CONTEXT_KEY, null)
}

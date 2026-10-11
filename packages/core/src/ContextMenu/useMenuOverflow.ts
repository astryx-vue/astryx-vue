import type { Ref } from 'vue'
import { useOverflow } from '../composables/useOverflow.js'

/**
 * 旧名字。新代码用 `useOverflow(元素, 是否有效)`。
 * 签名保持不变：只回答菜单面板的内容是不是比盒子高。
 */
export function useMenuOverflow(panel: Ref<HTMLElement | null>, isOpen: Ref<boolean>): Ref<boolean> {
  return useOverflow(panel, isOpen)
}

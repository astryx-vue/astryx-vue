import { inject } from 'vue'
import { mobileNavCloseKey } from './context.js'

/**
 * 抽屉里的行被激活后，用返回的函数关掉抽屉。
 * 不在抽屉里时返回一个什么都不做的函数，行不用再判断自己在不在抽屉里。
 */
export function useCloseMobileDrawer(): () => void {
  const close = inject(mobileNavCloseKey, undefined)
  return () => close?.()
}

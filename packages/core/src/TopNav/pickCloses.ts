import { provide } from 'vue'
import { getInteractionModality, getLastPointerType, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { navMenuPickKey } from '../NavMenu/context.js'

/**
 * 刚才这一下选中会不会关闭顶栏菜单：键盘选中、手指或触控笔按下的会关；
 * 鼠标或触控板选中不关（菜单靠指针移开收起），拿不到设备类型的指针选中也不关。
 */
export function pickCloses(): boolean {
  trackInteractionModality()
  if (getInteractionModality() === 'keyboard')
    return true
  const type = getLastPointerType()
  return type === 'touch' || type === 'pen'
}

/** TopNavMenu、TopNavMegaMenu 调用：让里面的项按 pickCloses 决定要不要关菜单，并提前装上输入跟踪。 */
export function provideTopNavPick(): void {
  trackInteractionModality()
  provide(navMenuPickKey, pickCloses)
}

import type { InjectionKey } from 'vue'

/** 内容渲染在移动导航抽屉里时为 true。菜单在这里改成内联折叠，不再弹出。 */
export const mobileNavKey: InjectionKey<true> = Symbol('astryx-mobile-nav')

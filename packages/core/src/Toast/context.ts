import type { InjectionKey } from 'vue'

/**
 * 视口提供给里面的提示：卡片在视口里才是 live 区域。
 * 单独渲染的 `Toast` 不带 live 角色，播报交给调用方。
 */
export const TOAST_VIEWPORT_KEY: InjectionKey<true> = Symbol('astryx-toast-viewport')

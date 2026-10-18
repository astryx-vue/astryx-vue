import type { ToastPlacement } from '../Toast/types.js'

/**
 * 视口某条边上的常驻条，只声明一次。
 * 数字按 px 算，字符串可以是任意 CSS 长度，例如 `'4rem'` 或 `'env(safe-area-inset-bottom, 0px)'`。
 */
export interface LayerInset {
  blockStart?: number | string
  blockEnd?: number | string
  inlineStart?: number | string
  inlineEnd?: number | string
}

/** `useToast` 用的 toast 视口配置。 */
export interface LayerToastConfig {
  /** toast 视口贴在哪个角。 @default 'bottom-end' */
  position?: ToastPlacement
  /** 同时最多显示几条，多出来的先不渲染。不传则不限制。 */
  maxVisible?: number
  /** 只对 toast 生效的逐边偏移，给了就盖掉 provider 的同一条边。 */
  inset?: LayerInset
}

export interface LayerProviderProps {
  /** toast 视口的位置、可见条数和逐边偏移。 */
  toast?: LayerToastConfig
  /**
   * 浮在视口边缘的常驻条，每条边加到所有锚定浮层离该边的空隙上，
   * toast 视口也按同样的量挪进去。默认每条边都是 0。
   */
  inset?: LayerInset
}

export interface LayerProviderSlots {
  /** 应用子树，可以读这份浮层配置。 */
  default?: () => unknown
}

import type { InjectionKey } from 'vue'

/**
 * 在拥有加载任务的核心组件里为 true：它自己播报这个任务，
 * 所以组合进来的加载圈保持安静。只在 core 内部使用，不从 Spinner/index.ts 导出；
 * 应用代码要让组合的加载圈安静，给它写 `aria-hidden`。
 */
export const spinnerOwnerKey: InjectionKey<boolean> = Symbol('astryx-spinner-owner')

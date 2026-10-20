import type { InjectionKey } from 'vue'
import type { ScrollbarsContext } from './types.js'

/**
 * 最近的 `ScrollbarsProvider` 提供的内容。
 *
 * 这个文件只能用 `import type` 引 overlayscrollbars。
 * 所有滚动组件都会引它，没有套 provider 的用户不应该因此把 overlayscrollbars 打进包。
 */
export const scrollbarsKey: InjectionKey<ScrollbarsContext> = Symbol('astryx-scrollbars')

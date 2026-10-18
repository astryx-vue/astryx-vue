import type { ComputedRef } from 'vue'
import { useAstryxLocale } from './context.js'

export interface UseLocaleReturn {
  /**
   * 最近的 `InternationalizationProvider` 的 BCP 47 语言标签。
   * 没有 provider 时是 `'en'`。
   */
  locale: ComputedRef<string>
}

/**
 * 对应原版 Astryx 的 `hooks/useLocale`。
 *
 * 读当前生效的语言标签。把它交给需要显式语言的纯函数或别的包，
 * 不要从 `navigator.language` 或者写死的字面量里另取一份，那样会跟 provider 对不上。
 */
export function useLocale(): UseLocaleReturn {
  return { locale: useAstryxLocale() }
}

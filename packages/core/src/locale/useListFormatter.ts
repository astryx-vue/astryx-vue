import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useAstryxLocale } from './context.js'

/**
 * 按当前语言把几段文字连成一个并列列表（英文是 `a, b, c`）。
 * 用 narrow 的并列格式：它在每种内置语言里都会用分隔符隔开各段，整句话也不会连在一起
 * （单位列表在 zh-CN 里没有分隔符，在 ja-JP 里只有空格）。
 * 没有 provider 时按英文连。
 */
export function useListFormatter(): ComputedRef<(items: readonly string[]) => string> {
  const locale = useAstryxLocale()
  return computed(() => {
    const format = new Intl.ListFormat(locale.value, { type: 'conjunction', style: 'narrow' })
    return (items: readonly string[]) => format.format(items)
  })
}

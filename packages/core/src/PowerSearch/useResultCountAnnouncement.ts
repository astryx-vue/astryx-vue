import type { Ref } from 'vue'
import { ref, watch } from 'vue'

/**
 * 结果数变化时给读屏的播报文字。挂载时已经有的数不念，只念之后的变化：
 * 数字交给 `format` 写成句子，字符串原样念。
 */
export function useResultCountAnnouncement(
  count: () => number | string | undefined,
  format: (count: number) => string,
): Ref<string> {
  const liveText = ref('')
  let sawCount = false
  watch(count, (value) => {
    if (!sawCount) {
      sawCount = true
      return
    }
    if (typeof value === 'number')
      liveText.value = format(value)
    else if (typeof value === 'string')
      liveText.value = value
  }, { immediate: true })
  return liveText
}

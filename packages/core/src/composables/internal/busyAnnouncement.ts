import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'
import { useAnnounce } from '../useAnnounce.js'

/**
 * 控件里的忙碌 Spinner 只是装饰（不对读屏暴露），忙碌状态由控件自己播报：
 * 每次进入忙碌只念一次，重新渲染不重复，忙完之后再次忙碌会再念。
 */
export function useBusyAnnouncement(isBusy: MaybeRefOrGetter<boolean>, message: MaybeRefOrGetter<string>): void {
  const announce = useAnnounce()
  watch(() => toValue(isBusy), (busy) => {
    if (busy)
      announce(toValue(message))
  }, { immediate: true })
}

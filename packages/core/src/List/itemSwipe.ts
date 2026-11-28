import type { ComputedRef } from 'vue'
import type { SwipeHost, SwipeRowFacts } from '../Swipe/swipeHost.js'
import type { ItemProps } from './types.js'
import { computed } from 'vue'
import { useDevWarning } from '../composables/useDevWarning.js'
import { createSwipeHost } from '../Swipe/createSwipe.js'
import { swipeHostOf } from '../Swipe/swipeHost.js'

/**
 * 行实际跑的横滑：`swipe`（createSwipe 造的）优先，否则是已弃用的 `swipeActions` 和
 * `swipeBehavior`。两条路用同一套规则和面板。横滑不服务这一行（role 不允许、禁用、
 * 放大点击区、没有操作）时是 null。
 */
export function useItemSwipeHost(
  props: Pick<ItemProps, 'swipe' | 'swipeActions' | 'swipeBehavior' | 'itemKey'>,
  facts: () => SwipeRowFacts,
): ComputedRef<SwipeHost | null> {
  const legacyHost = computed(() => {
    if (props.swipe != null || props.swipeActions == null)
      return null
    return createSwipeHost(
      props.swipeActions.leading ?? [],
      props.swipeActions.trailing ?? [],
      props.swipeBehavior ?? 'reveal',
    )
  })

  useDevWarning(
    'Item',
    '`swipeBehavior="commit"` fires no entry on a side with two or more entries. '
    + 'Give a committing side one entry, or use `swipeBehavior="reveal"`.',
    () => {
      const host = legacyHost.value
      return host != null && host.behavior === 'commit' && (host.leading.length > 1 || host.trailing.length > 1)
    },
  )
  useDevWarning(
    'Item',
    '`swipe` is set, so the deprecated `swipeActions` and `swipeBehavior` are ignored.',
    () => props.swipe != null && (props.swipeActions != null || props.swipeBehavior != null),
  )

  return computed(() => {
    const host = props.swipe != null ? swipeHostOf(props.swipe) : legacyHost.value
    if (host == null || !host.serves(facts()))
      return null
    return host.itemKey == null && props.itemKey != null ? { ...host, itemKey: props.itemKey } : host
  })
}

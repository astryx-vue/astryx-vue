import type { ComputedRef } from 'vue'
import type { TokenizerProps } from './types.js'
import { computed } from 'vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'

/**
 * 禁用的 Tokenizer 仍是 Tab 停点：输入框用 aria-disabled 加只读，不用原生 disabled，
 * 有禁用说明时悬停和键盘聚焦都能读到它。
 * 例外是 `overflow="unfocused-layer"` 且没有说明：输入框在失焦时才展开的浮层里，
 * 禁用的字段打不开那层，此时仍用原生 disabled。
 */
export function useTokenizerDisabled(props: Pick<TokenizerProps, 'disabled' | 'disabledMessage' | 'disabledReason' | 'overflow'>): {
  disabledMessage: ComputedRef<string | undefined>
  showsDisabledMessage: ComputedRef<boolean>
  focusableDisabled: ComputedRef<boolean>
  disabledTooltip: ReturnType<typeof useButtonTooltip>
} {
  /** 新名 disabledMessage 优先，旧名 disabledReason 继续可用。 */
  const disabledMessage = computed(() => {
    const message = props.disabledMessage?.trim() ? props.disabledMessage : props.disabledReason
    return message?.trim() ? message : undefined
  })
  const showsDisabledMessage = computed(() => Boolean(props.disabled) && Boolean(disabledMessage.value))
  const focusableDisabled = computed(() => Boolean(props.disabled) && (showsDisabledMessage.value || props.overflow !== 'unfocused-layer'))
  const disabledTooltip = useButtonTooltip(showsDisabledMessage)
  return { disabledMessage, showsDisabledMessage, focusableDisabled, disabledTooltip }
}

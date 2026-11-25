import type { ComputedRef } from 'vue'
import type { AstryxMessages } from './messages.js'
import { computed, inject, toValue } from 'vue'
import { astryxMessagesKey, useAstryxLocale } from './context.js'
import { astryxMessages } from './messages.js'

/**
 * 一个语言标签对应的整份内置文案。只有简体中文有自己的一份，其余语言都用英文。
 * 别的语言要显示本地文字，得通过 `messages` 交进来。
 */
export function builtInMessages(locale: string): AstryxMessages {
  return locale === 'zh-CN' ? astryxMessages['zh-CN'] : astryxMessages.en
}

/**
 * 整份 `AstryxMessages`。外层 provider 交了文案树就用它，否则用当前语言的内置文案。
 * 会把全部命名空间的内置文案带进包里；组件内部改用 `useComponentMessages` 按命名空间读。
 */
export function useAstryxMessages(): ComputedRef<AstryxMessages> {
  const locale = useAstryxLocale()
  const provided = inject(astryxMessagesKey, undefined)
  return computed(() => {
    if (provided != null)
      return toValue(provided)
    return builtInMessages(locale.value)
  })
}

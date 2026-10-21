import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { AstryxMessages } from './messages.js'
import { computed, inject, provide, toValue } from 'vue'
import { astryxMessages } from './messages.js'

export const astryxLocaleKey: InjectionKey<MaybeRefOrGetter<string>> = Symbol('astryx-locale')
export const astryxMessagesKey: InjectionKey<MaybeRefOrGetter<AstryxMessages>> = Symbol('astryx-messages')

/**
 * 把语言标签收成规范写法。
 * `zh`、`zh-CN`、`zh-Hans` 收成 `zh-CN`，对上内置的简体中文文案。
 * 其余标签只做大小写规范，例如 `en-gb` 收成 `en-GB`，日期和数字因此按这个地区的习惯排。
 * 空值和解析不了的标签回到 `en`。
 */
export function normalizeLocale(locale: string | null | undefined): string {
  const trimmed = locale?.trim() ?? ''
  if (trimmed === '')
    return 'en'
  let parsed: Intl.Locale
  try {
    parsed = new Intl.Locale(trimmed)
  }
  catch {
    return 'en'
  }
  const base = parsed.baseName
  const lower = base.toLowerCase()
  if (lower === 'zh' || lower === 'zh-cn' || lower === 'zh-hans' || lower.startsWith('zh-hans-'))
    return 'zh-CN'
  return base
}

export function provideAstryxLocale(
  locale: MaybeRefOrGetter<string>,
  messages?: MaybeRefOrGetter<AstryxMessages>,
): void {
  provide(astryxLocaleKey, computed(() => normalizeLocale(toValue(locale))))
  if (messages !== undefined)
    provide(astryxMessagesKey, computed(() => toValue(messages)))
}

export function useAstryxLocale(): ComputedRef<string> {
  const injected = inject(astryxLocaleKey, undefined)
  return computed(() => injected == null ? 'en' : normalizeLocale(toValue(injected)))
}

/**
 * 一个语言标签对应的内置文案。只有简体中文有自己的一份，其余语言都用英文。
 * 别的语言要显示本地文字，得通过 `messages` 交进来。
 */
export function builtInMessages(locale: string): AstryxMessages {
  return locale === 'zh-CN' ? astryxMessages['zh-CN'] : astryxMessages.en
}

export function useAstryxMessages(): ComputedRef<AstryxMessages> {
  const locale = useAstryxLocale()
  const provided = inject(astryxMessagesKey, undefined)
  return computed(() => {
    if (provided != null)
      return toValue(provided)
    return builtInMessages(locale.value)
  })
}

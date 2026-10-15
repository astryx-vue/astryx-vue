import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { AstryxMessages } from './messages.js'
import { computed, inject, provide, toValue } from 'vue'
import { astryxMessages } from './messages.js'

export const astryxLocaleKey: InjectionKey<MaybeRefOrGetter<string>> = Symbol('astryx-locale')
export const astryxMessagesKey: InjectionKey<MaybeRefOrGetter<AstryxMessages>> = Symbol('astryx-messages')

/**
 * 把语言标签收成组件能用的写法。
 * `en` 和 `en-*` 收成 `en`。`zh`、`zh-CN`、`zh-Hans` 收成 `zh-CN`。
 * `zh-TW` 以及其他标签保留规范写法，用来接 `loadAstryxCatalog` 的结果。
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
  if (lower === 'en' || lower.startsWith('en-'))
    return 'en'
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

export function useAstryxMessages(): ComputedRef<AstryxMessages> {
  const locale = useAstryxLocale()
  const provided = inject(astryxMessagesKey, undefined)
  return computed(() => {
    if (provided != null)
      return toValue(provided)
    return locale.value === 'zh-CN' ? astryxMessages['zh-CN'] : astryxMessages.en
  })
}

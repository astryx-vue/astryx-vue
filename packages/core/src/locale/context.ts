import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { AstryxLocale, AstryxMessages } from './types.js'
import { computed, inject, provide, toValue } from 'vue'
import { astryxMessages } from './messages.js'

export const astryxLocaleKey: InjectionKey<MaybeRefOrGetter<AstryxLocale>> = Symbol('astryx-locale')

export function normalizeLocale(locale: string | null | undefined): AstryxLocale {
  const value = locale?.trim().toLowerCase() ?? ''
  if (value === 'zh' || value.startsWith('zh-'))
    return 'zh-CN'
  return 'en'
}

export function provideAstryxLocale(locale: MaybeRefOrGetter<string>): void {
  provide(astryxLocaleKey, computed(() => normalizeLocale(toValue(locale))))
}

export function useAstryxLocale(): ComputedRef<AstryxLocale> {
  const injected = inject(astryxLocaleKey, undefined)
  return computed(() => injected == null ? 'en' : normalizeLocale(toValue(injected)))
}

export function useAstryxMessages(): ComputedRef<AstryxMessages> {
  const locale = useAstryxLocale()
  return computed(() => astryxMessages[locale.value])
}

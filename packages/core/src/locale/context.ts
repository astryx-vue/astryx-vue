import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { AstryxMessages } from './messages.js'
import type { AstryxLocale } from './types.js'
import { computed, inject, provide, toValue } from 'vue'

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

/** 组件自带的默认文案：命名空间 → 每种内置语言的一份。只放这个组件自己用到的命名空间。 */
export type ComponentMessageDefaults = {
  [K in keyof AstryxMessages]?: Record<AstryxLocale, AstryxMessages[K]>
}

/** 按 `defaults` 的命名空间挑出来的文案，形状和 `AstryxMessages` 的对应字段一致。 */
export type ComponentMessages<D extends ComponentMessageDefaults> = {
  [K in keyof D & keyof AstryxMessages]: AstryxMessages[K]
}

/**
 * 组件读内置文案的入口。组件只把自己用到的命名空间交进来，
 * 打包时就只带上这几份文案，不会把整份 `AstryxMessages` 一起带进去。
 *
 * 外层 provider 交了文案树时取树里的同名命名空间；没有 provider 时按当前语言取 `defaults`。
 */
export function useComponentMessages<D extends ComponentMessageDefaults>(defaults: D): ComputedRef<ComponentMessages<D>> {
  const locale = useAstryxLocale()
  const provided = inject(astryxMessagesKey, undefined)
  return computed(() => {
    const tree = provided == null ? undefined : toValue(provided) as Partial<AstryxMessages>
    const language: AstryxLocale = locale.value === 'zh-CN' ? 'zh-CN' : 'en'
    const picked: Record<string, unknown> = {}
    for (const name of Object.keys(defaults) as (keyof AstryxMessages)[])
      picked[name] = tree?.[name] ?? defaults[name]?.[language]
    return picked as ComponentMessages<D>
  })
}

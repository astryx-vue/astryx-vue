import type { AstryxMessages } from './messages.js'
import { useAstryxMessages } from './context.js'
import { upstreamMessageMap } from './upstreamMap.js'

/** 填进消息占位符的值。数字用来算复数和千分位。 */
export type TranslatorValues = Record<string, string | number>

/** 拿原文键换当前语言下的成品文案。 */
export type Translator = (key: string, values?: TranslatorValues) => string

export interface UseTranslatorReturn {
  /**
   * 绑在当前 `InternationalizationProvider` 上的翻译函数。
   * 生效的语言、`messages` 和 `overrides` 都由 provider 决定，这里只负责按键取。
   */
  t: Translator
}

/**
 * 对应原版 Astryx 的 `hooks/useTranslator`。
 *
 * 返回一个翻译函数，把原版的消息键（例如 `@astryx.pagination.next`）换成
 * 当前语言下的成品文案。语言、`messages` 目录和 `overrides` 都取自最近的
 * `InternationalizationProvider`；没有 provider 时用包内自带的英文文案。
 *
 * 占位符的值按参数顺序填进去，复数和千分位按当前语言的规则算。
 * 认不出来的键原样返回。
 */
export function useTranslator(): UseTranslatorReturn {
  const messages = useAstryxMessages()
  return { t: (key, values) => translate(messages.value, key, values) }
}

function translate(messages: AstryxMessages, key: string, values?: TranslatorValues): string {
  const target = upstreamMessageMap[key]?.[0]
  if (target == null)
    return key

  const message = readMessageValue(messages, target.path)
  if (typeof message === 'string')
    return message
  if (typeof message === 'function') {
    const args = (target.args ?? []).map(name => values?.[name])
    return (message as (...args: unknown[]) => string)(...args)
  }
  return key
}

function readMessageValue(messages: AstryxMessages, path: string): unknown {
  let cursor: unknown = messages
  for (const part of path.split('.')) {
    if (cursor == null || typeof cursor !== 'object')
      return undefined
    cursor = (cursor as Record<string, unknown>)[part]
  }
  return cursor
}

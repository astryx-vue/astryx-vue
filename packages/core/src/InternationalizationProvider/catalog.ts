import type { AstryxUpstreamCatalog, AstryxUpstreamMessage } from '../locale/loadCatalog.js'
import type { AstryxMessages } from '../locale/messages.js'
import { builtInMessages, normalizeLocale } from '../locale/context.js'
import { formatIcu, icuPlaceholderNames } from '../locale/icu.js'
import { loadAstryxCatalog } from '../locale/loadCatalog.js'
import { upstreamMessageMap } from '../locale/upstreamMap.js'

/**
 * 一种语言的原版文案目录，键是 `@astryx.*`，和 `loadAstryxCatalog` 收的 JSON 一个形状。
 * 原版文档里的 `ProviderMessagesByLocale` 和 `Overrides` 都是这个形状。
 */
export type ProviderMessagesByLocale = Record<string, AstryxUpstreamCatalog>

/** 每个 locale 的稀疏覆盖。只写要改的键，其余沿用底层文案。 */
export type ProviderOverrides = ProviderMessagesByLocale

interface MessageTree {
  [key: string]: string | ((...args: never[]) => string) | MessageTree
}

/**
 * 把 `messages` 和 `overrides` 合成本次渲染要用的文案树。
 *
 * 先取该 locale 的底层文案：`messages` 里有就用目录映射出来的结果，否则用内置文案。
 * 再把 `overrides` 逐键叠在上面。两者都没有时直接返回内置文案，不新建对象。
 */
export function resolveProviderMessages(
  locale: string,
  messages?: ProviderMessagesByLocale,
  overrides?: ProviderOverrides,
): AstryxMessages {
  const tag = normalizeLocale(locale)
  const baseLanguage = tag.split('-')[0] ?? tag

  const catalog = pickLocale(messages, tag, baseLanguage)
  const sparse = pickLocale(overrides, tag, baseLanguage)

  if (catalog == null && sparse == null)
    return builtInMessages(tag)

  const base = catalog == null
    ? builtInMessages(tag)
    : loadAstryxCatalog(tag, catalog).messages

  return sparse == null ? base : applyCatalog(base, tag, sparse)
}

/** 先找完全同名的 locale，再找它的基础语言，例如 `fr-FR` 找 `fr`。 */
function pickLocale(
  map: ProviderMessagesByLocale | undefined,
  tag: string,
  baseLanguage: string,
): AstryxUpstreamCatalog | undefined {
  if (map == null)
    return undefined
  return map[tag] ?? (baseLanguage === tag ? undefined : map[baseLanguage])
}

/**
 * 把一份稀疏目录写到已有的文案树上，返回副本。
 * 键没有对应字段、占位符对不上、ICU 解析不了时跳过该键，其余字段保持原样。
 */
function applyCatalog(
  base: AstryxMessages,
  locale: string,
  catalog: AstryxUpstreamCatalog,
): AstryxMessages {
  const tree = cloneValue(base) as MessageTree

  for (const key of Object.keys(catalog).sort()) {
    const targets = upstreamMessageMap[key]
    if (targets == null)
      continue
    const message = readMessage(catalog[key])
    if (message == null)
      continue

    let names: string[]
    try {
      names = icuPlaceholderNames(message)
    }
    catch {
      continue
    }

    for (const target of targets) {
      const args: readonly string[] = target.args ?? []
      if (names.some(name => !args.includes(name)))
        continue
      try {
        writePath(tree, target.path, args.length === 0
          ? formatIcu(message, {}, locale)
          : bindMessage(message, args, locale))
      }
      catch {
        // 字段不存在或 ICU 求值失败时保留原值。
      }
    }
  }

  return tree as unknown as AstryxMessages
}

function readMessage(entry: AstryxUpstreamMessage | undefined): string | undefined {
  if (typeof entry === 'string')
    return entry
  if (entry != null && typeof entry === 'object' && typeof entry.defaultMessage === 'string')
    return entry.defaultMessage
  return undefined
}

function bindMessage(message: string, args: readonly string[], locale: string): (...values: never[]) => string {
  return (...values: never[]) => {
    const bag: Record<string, string | number | undefined> = {}
    args.forEach((name, index) => {
      const value = values[index]
      bag[name] = typeof value === 'number' || typeof value === 'string' ? value : undefined
    })
    return formatIcu(message, bag, locale).replace(/[ \t]{2,}/g, ' ').trim()
  }
}

function cloneValue(value: unknown): unknown {
  if (typeof value === 'function' || value == null || typeof value !== 'object')
    return value
  const copy: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value))
    copy[key] = cloneValue(child)
  return copy
}

function writePath(tree: MessageTree, path: string, value: string | ((...args: never[]) => string)): void {
  const parts = path.split('.')
  let cursor: MessageTree = tree
  for (const part of parts.slice(0, -1)) {
    const next = cursor[part]
    if (next == null || typeof next === 'function' || typeof next === 'string')
      throw new Error(`消息路径不存在：${path}`)
    cursor = next
  }
  const leaf = parts[parts.length - 1]
  if (leaf == null || !Object.hasOwn(cursor, leaf))
    throw new Error(`消息路径不存在：${path}`)
  cursor[leaf] = value
}

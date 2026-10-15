import type { AstryxMessages } from './messages.js'
import type { UpstreamTarget } from './upstreamMap.js'
import { formatIcu, icuPlaceholderNames } from './icu.js'
import { astryxMessages } from './messages.js'
import { upstreamMessageMap } from './upstreamMap.js'

/** 原版 `locales/*.json` 里的一条。运行时目录也可以只给字符串。 */
export type AstryxUpstreamMessage = string | { defaultMessage: string, description?: string }

/** 原版语言目录。键是 `@astryx.*`。 */
export type AstryxUpstreamCatalog = Record<string, AstryxUpstreamMessage>

export type UnmappedUpstreamReason
  = | 'no-slot'
    | 'invalid-entry'
    | 'unsupported-message'
    | 'placeholder-mismatch'
    | 'slot-taken'

export interface UnmappedUpstreamEntry {
  key: string
  /** 原句。解析不了时保留目录里的原文，不丢掉。 */
  message: string
  reason: UnmappedUpstreamReason
}

export interface LoadedAstryxLocale {
  locale: string
  messages: AstryxMessages
  /** 这份 JSON 里没有写进 `messages` 的键，原文在 `message`。 */
  unmapped: readonly UnmappedUpstreamEntry[]
  /** 映射表里有，但这份 JSON 没给的键。这些字段继续用英文。 */
  missingKeys: readonly string[]
  /** 没有任何原版键写进来、因此仍是英文的字段路径。 */
  fallbackFields: readonly string[]
}

interface MessageTree {
  [key: string]: string | ((...args: never[]) => string) | MessageTree
}

/**
 * 把一份原版 Astryx locale JSON 映射成 `AstryxMessages`。
 * 内置的 `en` 和 `zh-CN` 不会被改掉。返回值要交给 `provideAstryxLocale` 的第二个参数。
 * `unmapped` 列出每一个没写进文案树的键。
 */
export function loadAstryxCatalog(locale: string, catalog: AstryxUpstreamCatalog): LoadedAstryxLocale {
  const messages = cloneMessages(astryxMessages.en)
  const tree = messages as unknown as MessageTree
  const assigned = new Set<string>()
  const unmapped: UnmappedUpstreamEntry[] = []
  const present = new Set<string>()

  for (const key of Object.keys(catalog).sort()) {
    present.add(key)
    const read = readMessage(catalog[key])
    if (read.message == null) {
      unmapped.push({ key, message: read.invalid, reason: 'invalid-entry' })
      continue
    }
    const targets = upstreamMessageMap[key]
    if (targets == null) {
      unmapped.push({ key, message: read.message, reason: 'no-slot' })
      continue
    }
    if (!writeTargets(tree, assigned, targets, read.message, locale)) {
      unmapped.push({
        key,
        message: read.message,
        reason: failureReason(targets, assigned, read.message),
      })
    }
  }

  const missingKeys = Object.keys(upstreamMessageMap).filter(key => !present.has(key)).sort()
  const fallbackFields = collectLeaves(tree).filter(path => !assigned.has(path)).sort()
  unmapped.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0)

  return {
    locale,
    messages,
    unmapped,
    missingKeys,
    fallbackFields,
  }
}

function writeTargets(
  tree: MessageTree,
  assigned: Set<string>,
  targets: readonly UpstreamTarget[],
  message: string,
  locale: string,
): boolean {
  let wrote = false
  let names: string[]
  try {
    names = icuPlaceholderNames(message)
  }
  catch {
    return false
  }
  for (const target of targets) {
    if (assigned.has(target.path))
      continue
    const args = target.args ?? []
    if (names.some(name => !args.includes(name)))
      continue
    let value: string | ((...args: never[]) => string)
    try {
      value = target.args == null
        ? cleanup(formatIcu(message, {}, locale))
        : bindMessage(message, target.args, locale)
    }
    catch {
      continue
    }
    setPath(tree, target.path, value)
    assigned.add(target.path)
    wrote = true
  }
  return wrote
}

function failureReason(targets: readonly UpstreamTarget[], assigned: Set<string>, message: string): UnmappedUpstreamReason {
  let names: string[]
  try {
    names = icuPlaceholderNames(message)
  }
  catch {
    return 'unsupported-message'
  }
  const openTargets = targets.filter(target => !assigned.has(target.path))
  if (openTargets.length === 0)
    return 'slot-taken'
  const mismatched = openTargets.some((target) => {
    const args = target.args ?? []
    return names.some(name => !args.includes(name))
  })
  return mismatched ? 'placeholder-mismatch' : 'unsupported-message'
}

function bindMessage(message: string, args: readonly string[], locale: string): (...values: never[]) => string {
  return (...values: never[]) => {
    const bag: Record<string, string | number | undefined> = {}
    args.forEach((name, index) => {
      bag[name] = coerce(values[index])
    })
    return cleanup(formatIcu(message, bag, locale))
  }
}

function coerce(value: unknown): string | number | undefined {
  if (typeof value === 'number' || typeof value === 'string')
    return value
  if (value == null)
    return undefined
  return String(value)
}

function cleanup(text: string): string {
  return text.replace(/[ \t]{2,}/g, ' ').trim()
}

function readMessage(entry: AstryxUpstreamMessage | undefined): { message: string, invalid?: undefined } | { message?: undefined, invalid: string } {
  if (typeof entry === 'string')
    return { message: entry }
  if (entry != null && typeof entry === 'object' && typeof entry.defaultMessage === 'string')
    return { message: entry.defaultMessage }
  return { invalid: JSON.stringify(entry) }
}

function cloneMessages(source: AstryxMessages): AstryxMessages {
  return cloneValue(source) as AstryxMessages
}

function cloneValue(value: unknown): unknown {
  if (typeof value === 'function' || value == null || typeof value !== 'object')
    return value
  const copy: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value))
    copy[key] = cloneValue(child)
  return copy
}

function setPath(tree: MessageTree, path: string, value: string | ((...args: never[]) => string)): void {
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

function collectLeaves(tree: MessageTree, prefix = ''): string[] {
  const paths: string[] = []
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix === '' ? key : `${prefix}.${key}`
    if (typeof value === 'string' || typeof value === 'function')
      paths.push(path)
    else
      paths.push(...collectLeaves(value, path))
  }
  return paths
}

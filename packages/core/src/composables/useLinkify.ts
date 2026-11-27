import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/** 一条自定义的识别规则。 */
export interface LinkifyPattern {
  /** 要匹配的正则，必须带全局标志 `g`。捕获组可以用在 `href` 和 `label` 里。 */
  pattern: RegExp
  /** 由一次匹配生成链接地址。 */
  href: (match: RegExpMatchArray) => string
  /** 链接上显示的文字，默认是整段匹配。 */
  label?: (match: RegExpMatchArray) => string
  /**
   * 是否是站外地址（新标签页打开）。
   * @default false
   */
  isExternal?: boolean
}

export interface UseLinkifyOptions {
  /** 自定义规则，排在内置规则前面：重叠时先找到的赢，起点相同则自定义规则赢。 */
  patterns?: readonly LinkifyPattern[]
  /**
   * 是否带上内置的 http(s) 网址和邮箱识别。
   * @default true
   */
  hasBuiltins?: boolean
}

/** 一段没有链接的纯文字。 */
export interface LinkifyTextSegment {
  type: 'text'
  text: string
}

/** 一段命中规则的文字，渲染成 `Link`。 */
export interface LinkifyLinkSegment {
  type: 'link'
  text: string
  href: string
  /** 对应 `Link` 的 `isExternalLink`。 */
  isExternal: boolean
}

export type LinkifySegment = LinkifyTextSegment | LinkifyLinkSegment

const BUILTIN_PATTERNS: readonly LinkifyPattern[] = [
  { pattern: /https?:\/\/[^\s<>'")\]},]+/g, href: match => match[0], isExternal: true },
  { pattern: /[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, href: match => `mailto:${match[0]}` },
]

interface ResolvedMatch {
  start: number
  end: number
  href: string
  label: string
  isExternal: boolean
}

/** 所有规则的匹配，重叠的只留先出现的；起点相同按规则的先后。 */
function findMatches(text: string, patterns: readonly LinkifyPattern[]): ResolvedMatch[] {
  const all: ResolvedMatch[] = []
  for (const rule of patterns) {
    // 复制正则，避免共用 lastIndex。
    const re = new RegExp(rule.pattern.source, rule.pattern.flags)
    for (const match of text.matchAll(re)) {
      all.push({
        start: match.index,
        end: match.index + match[0].length,
        href: rule.href(match),
        label: rule.label ? rule.label(match) : match[0],
        isExternal: rule.isExternal ?? false,
      })
    }
  }
  all.sort((a, b) => a.start - b.start)
  const kept: ResolvedMatch[] = []
  let lastEnd = 0
  for (const match of all) {
    if (match.start >= lastEnd) {
      kept.push(match)
      lastEnd = match.end
    }
  }
  return kept
}

/**
 * 把纯文字里的网址、邮箱和自定义格式（如 #123、T1234）切成「文字」和「链接」两种片段。
 * 渲染时文字原样输出，链接交给 `Link`。
 *
 * 文字或选项变了，片段会跟着变。空文字或没有命中时只有一段文字。
 */
export function useLinkify(
  text: MaybeRefOrGetter<string>,
  options?: MaybeRefOrGetter<UseLinkifyOptions | undefined>,
): ComputedRef<LinkifySegment[]> {
  return computed(() => {
    const source = toValue(text)
    const { patterns = [], hasBuiltins = true } = toValue(options) ?? {}
    const rules = hasBuiltins ? [...patterns, ...BUILTIN_PATTERNS] : patterns
    const matches = source.length === 0 || rules.length === 0 ? [] : findMatches(source, rules)
    if (matches.length === 0)
      return [{ type: 'text', text: source }]
    const segments: LinkifySegment[] = []
    let cursor = 0
    for (const match of matches) {
      if (match.start > cursor)
        segments.push({ type: 'text', text: source.slice(cursor, match.start) })
      segments.push({ type: 'link', text: match.label, href: match.href, isExternal: match.isExternal })
      cursor = match.end
    }
    if (cursor < source.length)
      segments.push({ type: 'text', text: source.slice(cursor) })
    return segments
  })
}

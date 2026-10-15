/** 创建行的值永远不是真实选项。选中它会走创建，而不是切换勾选。 */
export const CREATE_VALUE_PREFIX = '__astryx_multi_selector_create__'

export function createOptionValue(query: string): string {
  return `${CREATE_VALUE_PREFIX}${query}`
}

export function readCreateQuery(value: string | number): string | null {
  if (typeof value !== 'string' || !value.startsWith(CREATE_VALUE_PREFIX))
    return null
  return value.slice(CREATE_VALUE_PREFIX.length)
}

export interface CreateQueryInput {
  /** 同时开了创建和搜索，并且当前不在加载。 */
  enabled: boolean
  query: string
  labels: readonly string[]
}

/**
 * 输入去掉首尾空白后，和任何选项标签都不相同（忽略大小写）时，返回可以创建的文本。
 * 空字符串、加载中、没开搜索，都不提供创建行。
 */
export function resolveCreateQuery(input: CreateQueryInput): string | null {
  if (!input.enabled)
    return null
  const trimmed = input.query.trim()
  if (trimmed === '')
    return null
  const wanted = trimmed.toLowerCase()
  const exists = input.labels.some(label => label.toLowerCase() === wanted)
  return exists ? null : trimmed
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object')
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 把 `override` 深合并到 `base` 上，返回新对象，两个入参都不会被改动。
 * 只有纯对象会递归合并，数组和其他值直接用 `override` 的。
 * `override` 里值为 `undefined` 的字段会被忽略。
 */
export function mergeOptions<T extends object>(base: T, override?: object | null): T {
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  if (!override)
    return result as T
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined)
      continue
    const current = result[key]
    result[key] = isPlainObject(current) && isPlainObject(value)
      ? mergeOptions(current, value)
      : value
  }
  return result as T
}

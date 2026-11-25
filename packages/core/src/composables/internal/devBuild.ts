/** 是不是开发构建。生产构建里 `import.meta.env.DEV` 是 false，依赖它的分支整段会被摇掉。 */
export function isDevBuild(): boolean {
  return (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
}

/**
 * 对应原版 Astryx 的 `devPropError`。
 *
 * 开发构建里，必填的 prop 缺了或类型不对时抛一个点名的错误：说清楚是哪个组件、哪个 prop、
 * 该怎么传，而不是让组件内部报一个看不懂的 TypeError。生产构建里什么也不做。
 */
export function assertDevProp(isValid: boolean, component: string, prop: string, message: string): void {
  if (isValid || !isDevBuild())
    return
  throw new Error(`${component}: \`${prop}\` ${message}`)
}

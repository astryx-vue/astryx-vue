/** 生产构建里 `import.meta.env.DEV` 是 false，依赖它的开发期检查整段会被摇掉。 */
export function isDevBuild(): boolean {
  return (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
}

/**
 * 对应原版 Astryx 的 `devPropError`。
 *
 * 必填属性缺失或类型不对时，开发期抛出的错误：点名组件、属性和改法，
 * 免得调用方只看到组件内部的 TypeError。调用处要用 `isDevBuild()` 包住，
 * 生产构建里不做这项检查。
 */
export function devPropError(component: string, prop: string, message: string): Error {
  return new Error(`${component}: \`${prop}\` ${message}`)
}

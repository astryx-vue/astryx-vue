export interface UpstreamTarget {
  /** `AstryxMessages` 里的路径，例如 `pagination.nav`。 */
  path: string
  /**
   * 回调参数对应的 ICU 占位符名，顺序跟我们的函数参数一致。
   * 字符串字段不要写。
   */
  args?: readonly string[]
}

/** 一组原版键到文案字段的对照。一个键可以填多个字段。 */
export type UpstreamMapPart = Record<string, readonly UpstreamTarget[]>

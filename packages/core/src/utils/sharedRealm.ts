/**
 * 对应原版 Astryx 的 `utils/sharedRealm`。
 *
 * 整个 JavaScript 运行环境里按键共享一份值：页面上同时加载了两份 core（比如包本身和一份复制进项目的副本）时，
 * 两边拿同一个键读到的是同一份值。不碰 DOM，服务端也能用。
 */

/**
 * 共享值的注册键。版本号表示值的形状：形状变了、旧副本读不懂新值时就升版本，
 * 两边各用各的。
 */
export function sharedKey(name: string, version: number): symbol {
  return Symbol.for(`@astryx-vue/core/${name}/v${version}`)
}

/**
 * `key` 下的共享值，第一次用时创建。
 * `accepts` 防键撞车：它不认的值原样留着，这一份自己另建一个。
 */
export function realmValue<T>(
  key: symbol,
  create: () => T,
  accepts: (value: unknown) => boolean = () => true,
): T {
  const realm = globalThis as typeof globalThis & { [key: symbol]: unknown }
  if (Object.hasOwn(realm, key)) {
    const existing = realm[key]
    return accepts(existing) ? (existing as T) : create()
  }
  const value = create()
  realm[key] = value
  return value
}

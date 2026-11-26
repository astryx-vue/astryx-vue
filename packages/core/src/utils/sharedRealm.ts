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

/**
 * 按注册名在整页共享一份值：计数器、开关，或装着几样东西的对象。
 * 名字写成 `<目录>/<文件>/<绑定名>`（短横线小写），值的形状变了就升版本。
 */
export function sharedState<T>(
  name: string,
  version: number,
  create: () => T,
): T {
  return realmValue(sharedKey(name, version), create)
}

/** 按注册名共享的 Map。 */
export function sharedMap<K, V>(name: string, version: number): Map<K, V> {
  return sharedState(name, version, () => new Map<K, V>())
}

/** 按注册名共享的 WeakMap，例如按文档存的状态。 */
export function sharedWeakMap<K extends WeakKey, V>(
  name: string,
  version: number,
): WeakMap<K, V> {
  return sharedState(name, version, () => new WeakMap<K, V>())
}

/** 按注册名共享的 WeakSet，例如登记过的值。 */
export function sharedWeakSet<T extends WeakKey>(
  name: string,
  version: number,
): WeakSet<T> {
  return sharedState(name, version, () => new WeakSet<T>())
}

/** 按注册名共享的递增序号：每调一次返回下一个，从 1 开始。 */
export function sharedSequence(name: string, version: number): () => number {
  const counter = sharedState(name, version, () => ({ next: 0 }))
  return () => {
    counter.next += 1
    return counter.next
  }
}

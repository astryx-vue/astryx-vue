/**
 * ChatVirtualizer 的测量缓存和估价。
 *
 * 量过的行按身份记下真实高度；没量过的行用估价。传了固定数字的估价时，量出来的高度
 * 会累积成一个全局平均值（传了 getItemType 再按类型各算一份），之后用平均值给没量过的行估价，
 * 这样一行冷启动的行挂上去时几乎不会「发现」新的距离。平均值的变动有门槛：
 * 差出 10% 以上才改、滚动安静 250ms 后才改、目标还在收敛时不改。传函数估价时以函数为准。
 */

const GLOBAL_BUCKET = '\u0000global'
/** 收缩先验：攒到这么多真实样本时，桶自己的数据和继承来的基线各占一半。 */
const PRIOR_SAMPLES = 5
/** 用户最近一次滚动后，安静这么久才允许改估价。 */
const QUIET_MS = 250

interface Bucket { sum: number, count: number, eff: number }

export interface SizeEstimateOptions<T> {
  estimatedItemSize: number | ((item: T, index: number) => number)
  getItemType?: (item: T, index: number) => string
}

export interface RowSizes<T> {
  /** 量过的高度。 */
  readonly sizes: Map<string, number>
  /** 记一次测量。返回是否真的变了。0 不记：内容暂时为空的行会卡在末尾永远进不了窗口。 */
  record: (key: string, px: number) => boolean
  /** 记下一行的类型，供按类型求平均。 */
  noteType: (key: string, type: string) => void
  /** 本轮要不要改平均估价。返回是否改了（改了几何就脏了）。每轮只判一次。 */
  reprice: (options: SizeEstimateOptions<T>, canMove: boolean, lastUserEventAt: number) => boolean
  /** 一行现在的高度：量过的，否则估价。 */
  sizeOf: (options: SizeEstimateOptions<T>, key: string, item: T, index: number) => number
}

export function createRowSizes<T>(): RowSizes<T> {
  const sizes = new Map<string, number>()
  const buckets = new Map<string, Bucket>()
  const typeByKey = new Map<string, string>()

  const bucket = (type: string): Bucket => {
    let b = buckets.get(type)
    if (!b)
      buckets.set(type, (b = { sum: 0, count: 0, eff: 0 }))
    return b
  }

  const noteMeasured = (key: string, prev: number | undefined, px: number): void => {
    for (const type of [GLOBAL_BUCKET, typeByKey.get(key)]) {
      if (type === undefined)
        continue
      const b = bucket(type)
      if (prev === undefined) {
        b.sum += px
        b.count += 1
      }
      else {
        b.sum += px - prev
      }
    }
  }

  // 只读：价格要不要动在 reprice 里一轮判一次，不在逐行估价时判。
  const effectiveAvg = (type: string, baseline: number): number => {
    const b = buckets.get(type)
    return !b || b.count === 0 || b.eff === 0 ? baseline : b.eff
  }

  return {
    sizes,
    record(key, px) {
      if (px <= 0)
        return false
      const prev = sizes.get(key)
      if (prev === px)
        return false
      noteMeasured(key, prev, px)
      sizes.set(key, px)
      return true
    },
    noteType(key, type) {
      typeByKey.set(key, type)
    },
    reprice({ estimatedItemSize, getItemType }, canMove, lastUserEventAt) {
      if (typeof estimatedItemSize === 'function' || !canMove)
        return false
      const quiet = performance.now() - lastUserEventAt > QUIET_MS
      let moved = false
      // 桶的有效价从继承来的基线起步，第一次见到的类型不会造成一次大规模重估。
      const settle = (b: Bucket | undefined, baseline: number): number => {
        if (!b || b.count === 0)
          return baseline
        const raw = (b.sum + PRIOR_SAMPLES * baseline) / (b.count + PRIOR_SAMPLES)
        if (b.eff === 0)
          b.eff = baseline > 0 ? baseline : raw
        if (quiet && Math.abs(raw - b.eff) > b.eff * 0.1) {
          b.eff = raw
          moved = true
        }
        return b.eff
      }
      // 先定全局：它是每个类型桶收缩的基线。
      const global = settle(buckets.get(GLOBAL_BUCKET), estimatedItemSize)
      if (getItemType) {
        for (const [type, b] of buckets) {
          if (type !== GLOBAL_BUCKET)
            settle(b, global)
        }
      }
      return moved
    },
    sizeOf({ estimatedItemSize, getItemType }, key, item, index) {
      const measured = sizes.get(key)
      if (measured !== undefined)
        return measured
      if (typeof estimatedItemSize === 'function')
        return estimatedItemSize(item, index)
      const global = effectiveAvg(GLOBAL_BUCKET, estimatedItemSize)
      return getItemType ? effectiveAvg(getItemType(item, index), global) : global
    },
  }
}

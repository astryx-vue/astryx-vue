/**
 * JSON 层面的三方合并，用来解决 package.json 这类「一部分字段归 `pnpm sync` 管」的文件冲突。
 *
 * 规则（逐个字段比较，对象递归，数组和其它值整体比较）：
 * - 两边一样，取任一边；
 * - 只有一边相对共同祖先变了，取变了的那一边；
 * - 两边都变了、且都是对象，逐个键递归；
 * - 两边都变了、改法不同，记为冲突；
 * - 归 sync 管的位置（isOwned 返回 true）不比较，只取 ours（ours 没有就去掉），之后由 sync 重新生成。
 *   这样 theirs 新增的生成条目由 sync 按它自己的规则插入，结果和在 ours 上直接跑 sync 一样。
 * 键的顺序以 ours 为准，theirs 新增的键插在它在 theirs 里的前一个键后面。
 */

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function sameValue(a, b) {
  if (a === b)
    return true
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((item, index) => sameValue(item, b[index]))
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length && keys.every(key => Object.hasOwn(b, key) && sameValue(a[key], b[key]))
  }
  return false
}

/** ours 的键按原顺序，theirs 独有的键跟在它在 theirs 里的前一个键后面。 */
function mergedKeyOrder(ours, theirs) {
  const order = Object.keys(ours)
  let previous = null
  for (const key of Object.keys(theirs)) {
    if (!order.includes(key))
      order.splice(previous === null ? 0 : order.indexOf(previous) + 1, 0, key)
    previous = key
  }
  return order
}

function mergeValue(path, base, ours, theirs, isOwned, conflicts) {
  if (isOwned(path))
    return ours
  if (sameValue(ours, theirs))
    return ours
  if (sameValue(base, ours))
    return theirs
  if (sameValue(base, theirs))
    return ours
  if (isPlainObject(ours) && isPlainObject(theirs) && (base === undefined || isPlainObject(base))) {
    const result = {}
    for (const key of mergedKeyOrder(ours, theirs)) {
      const value = mergeValue([...path, key], base?.[key], ours[key], theirs[key], isOwned, conflicts)
      if (value !== undefined)
        result[key] = value
    }
    return result
  }
  conflicts.push(path)
  return ours
}

/**
 * 三方合并三份 JSON 值。
 * @param {{ base: unknown, ours: unknown, theirs: unknown, isOwned?: (path: string[]) => boolean }} input
 *   base 是共同祖先（没有时传 undefined），isOwned 判断某个位置是否归 sync 管
 * @returns {{ value: unknown, conflicts: string[][] }} 合并结果，以及两边改法不同的位置
 */
export function mergeJson({ base, ours, theirs, isOwned = () => false }) {
  const conflicts = []
  const value = mergeValue([], base, ours, theirs, isOwned, conflicts)
  return { value, conflicts }
}

/** 把 JSON 路径写成 `publishConfig.access`、`exports["./Button"]` 这样便于阅读的形式。 */
export function formatJsonPath(path) {
  if (path.length === 0)
    return '（整个文件）'
  return path.map((key, index) => /^[A-Z_$][\w$]*$/i.test(key) ? `${index === 0 ? '' : '.'}${key}` : `[${JSON.stringify(key)}]`).join('')
}

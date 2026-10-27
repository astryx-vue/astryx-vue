/**
 * 比较「看得见的标签」和「浏览器算出的名称」时用的规则。
 *
 * WCAG 2.5.3 关心的是词：大小写和标点不算差别，所以先统一成小写、去掉标点再按词比。
 * 用词序列比较而不是子串比较：「Sync」是「Syncing photos」的子串，但说「Sync」并不是在说这个标签。
 */

export function spokenWords(value: string): readonly string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .filter(word => word !== '')
}

/** `whole` 里是否连续、按顺序出现了 `part` 的全部词。 */
export function saysInOrder(whole: readonly string[], part: readonly string[]): boolean {
  if (part.length === 0)
    return true
  return whole.some((_, index) => part.every((word, offset) => whole[index + offset] === word))
}

/** 两段文字说的是不是同一串词。 */
export function sameWords(actual: string, expected: string): boolean {
  const a = spokenWords(actual)
  const b = spokenWords(expected)
  return a.length === b.length && a.every((word, index) => word === b[index])
}

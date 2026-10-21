import { countCharacters } from '../text/countCharacters.js'

export { countCharacters }

/**
 * 查询短于下限时不该去搜数据源。
 * 空查询不算「太短」——空查询走的是 bootstrap，不是搜索。
 */
export function isBelowMinQueryLength(query: string, minQueryLength: number): boolean {
  const length = countCharacters(query)
  return length > 0 && length < minQueryLength
}

/**
 * 查询长度按「人眼看到的字符」数，不按 UTF-16 码元数。
 * 一个 emoji、一面旗、一个带音标的字母都算一个字符。
 */
const graphemeSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null

export function countCharacters(text: string): number {
  if (text === '')
    return 0
  if (graphemeSegmenter != null)
    return [...graphemeSegmenter.segment(text)].length
  return [...text].length
}

/**
 * 查询短于下限时不该去搜数据源。
 * 空查询不算「太短」——空查询走的是 bootstrap，不是搜索。
 */
export function isBelowMinQueryLength(query: string, minQueryLength: number): boolean {
  const length = countCharacters(query)
  return length > 0 && length < minQueryLength
}

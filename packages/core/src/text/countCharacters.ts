/**
 * 按人眼看到的字符数，不按 UTF-16 码元数。
 * 一个 emoji、一面旗、一个带音标的字母都算一个。
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

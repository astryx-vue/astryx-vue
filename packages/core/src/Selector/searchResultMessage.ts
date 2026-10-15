export interface SearchResultMessageInput {
  isOpen: boolean
  isLoading: boolean
  query: string
  matchCount: number
  hasCreateRow?: boolean
  emptyText: string
  emptySearchText: string
  resultCount: (count: number) => string
}

/**
 * 面板打开时要说的那句话。
 * 加载中什么都不说，因为选项还没到，不能断言「没有选项」或「没有结果」。
 * 创建行本身算一条结果，所以这时不报空。
 */
export function searchResultMessage(input: SearchResultMessageInput): string {
  if (!input.isOpen || input.isLoading)
    return ''
  const searching = input.query.trim() !== ''
  if (input.matchCount === 0 && !input.hasCreateRow)
    return searching ? input.emptySearchText : input.emptyText
  if (!searching)
    return ''
  return input.resultCount(input.matchCount + (input.hasCreateRow ? 1 : 0))
}

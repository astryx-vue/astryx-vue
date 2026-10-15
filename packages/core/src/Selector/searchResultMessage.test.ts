import { describe, expect, it } from 'vitest'
import { searchResultMessage } from './searchResultMessage.js'

const base = {
  isOpen: true,
  isLoading: false,
  query: '',
  matchCount: 0,
  emptyText: 'No options',
  emptySearchText: 'No results found',
  resultCount: (count: number) => `${count} results`,
}

describe('searchResultMessage', () => {
  it('stays silent while closed or loading', () => {
    expect(searchResultMessage({ ...base, isOpen: false })).toBe('')
    expect(searchResultMessage({ ...base, isLoading: true, query: 'x' })).toBe('')
  })

  it('uses the catalog message when nothing was supplied, and the search message when a query misses', () => {
    expect(searchResultMessage(base)).toBe('No options')
    expect(searchResultMessage({ ...base, query: 'pear' })).toBe('No results found')
  })

  it('counts a create row as a result', () => {
    expect(searchResultMessage({ ...base, query: 'pear', hasCreateRow: true })).toBe('1 results')
  })
})

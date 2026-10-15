import { describe, expect, it } from 'vitest'
import { createOptionValue, readCreateQuery, resolveCreateQuery } from './createOption.js'

describe('resolveCreateQuery', () => {
  it('offers the trimmed query when no label matches, ignoring case', () => {
    expect(resolveCreateQuery({
      enabled: true,
      query: '  Pear  ',
      labels: ['Apple'],
    })).toBe('Pear')
    expect(resolveCreateQuery({
      enabled: true,
      query: 'apple',
      labels: ['Apple'],
    })).toBeNull()
  })

  it('offers nothing without search, while loading, or for a blank query', () => {
    expect(resolveCreateQuery({ enabled: false, query: 'Pear', labels: [] })).toBeNull()
    expect(resolveCreateQuery({ enabled: true, query: '   ', labels: [] })).toBeNull()
  })

  it('round-trips the synthetic value', () => {
    expect(readCreateQuery(createOptionValue('Pear'))).toBe('Pear')
    expect(readCreateQuery('Pear')).toBeNull()
  })
})

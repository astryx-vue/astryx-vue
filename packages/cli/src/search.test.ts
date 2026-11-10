import { describe, expect, it } from 'vitest'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
import { searchCatalog } from './query.ts'

interface SearchResult {
  domain: string
  name: string
  score: number
  reason: string
  title: string
}

async function search(argv: string[]): Promise<SearchResult[]> {
  const result = await runCli(['search', ...argv, '--json'])
  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  return (assertResponse(result.stdout, 'search').data as { results: SearchResult[] }).results
}

describe('search compound names and word forms', () => {
  it('puts the longest compound named inside a longer query first', () => {
    const { results } = searchCatalog('table header cell with sort arrow', 'en', { limit: 5 })
    expect(results[0]).toMatchObject({ domain: 'component', name: 'TableHeaderCell', reason: 'name' })
  })

  it('finds a composable by its words without the use prefix and with a singular form', async () => {
    const results = await search(['table column setting', '--type', 'composable', '--limit', '5'])
    expect(results[0]).toMatchObject({ name: 'useTableColumnSettings', reason: 'name' })
  })

  it('ignores an extra verb-form word when the rest names a composable', async () => {
    const results = await search(['persisted table column settings', '--limit', '5'])
    expect(results[0]).toMatchObject({ domain: 'composable', name: 'useTableColumnSettings', reason: 'name' })
  })

  it('matches plural words in a compound name', async () => {
    const results = await search(['dropdown menu radio items', '--type', 'component', '--limit', '5'])
    expect(results[0]).toMatchObject({ name: 'DropdownMenuRadioItem', reason: 'name' })
  })

  it('finds a concept written as separate words', async () => {
    const results = await search(['key value pairs', '--limit', '5'])
    expect(results[0]).toMatchObject({ domain: 'component', name: 'MetadataList' })
  })

  it('keeps a complete compound name above a non-contiguous word match', async () => {
    const results = await search(['table header with sticky columns', '--limit', '20'])
    const names = results.map(result => result.name)
    const sticky = names.indexOf('useTableStickyColumns')
    expect(names.indexOf('TableHeader')).toBeLessThan(sticky === -1 ? Infinity : sticky)
  })

  it('reads a camelCase query as words', async () => {
    const results = await search(['useTablePaginationState', '--type', 'composable', '--limit', '5'])
    expect(results[0]).toMatchObject({ name: 'useTablePagination', reason: 'name' })
  })

  it('keeps both identifiers of a multi-name query at the top', async () => {
    const results = await search(['ChatMessageList ChatComposer', '--type', 'component', '--limit', '5'])
    expect(results.slice(0, 2).map(result => result.name).sort()).toEqual(['ChatComposer', 'ChatMessageList'])
  })

  it('ranks a longer partial name above a shorter named entry', async () => {
    const results = await search(['dropdown menu radio options', '--type', 'component', '--limit', '5'])
    expect(results[0]?.name).toBe('DropdownMenuRadioGroup')
    expect(results[0]?.score).toBeGreaterThan(results.find(result => result.name === 'DropdownMenu')?.score ?? 0)
  })

  it('does not invent a match for an unrelated identifier', async () => {
    expect(await search(['qqzz_no_match_here', '--limit', '5'])).toEqual([])
  })
})

describe('search template display names', () => {
  it('treats an authored template title as a name', async () => {
    const results = await search(['Page Editor', '--type', 'template', '--limit', '5'])
    expect(results[0]).toMatchObject({ name: 'editor', title: 'Page Editor', score: 100, reason: 'name' })
  })
})

describe('failed lookup suggestion order', () => {
  it('puts compound relatives before an incidental short-name match without changing the candidate set', async () => {
    const result = await runCli(['component', 'TableHeaderCellFooter', '--json'])
    expect(result.exitCode).toBe(1)
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      return
    expect(envelope.code).toBe('ERR_UNKNOWN_COMPONENT')
    expect(envelope.suggestions?.map(suggestion => suggestion.name)).toEqual([
      'TableHeaderCell',
      'TableHeader',
      'Table',
      'Tab',
    ])
  })
})

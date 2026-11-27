import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse, isError, parseResponse } from './envelope.ts'
import { keywordOwners } from './query-keywords.ts'
import { compareText } from './query-order.ts'
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

describe('search other names for a component', () => {
  it.each([
    ['ScrollArea viewport', 'ScrollableArea'],
    ['toggle group of buttons', 'ToggleButtonGroup'],
    ['circular progress for uploads', 'Spinner'],
    ['AppHeader', 'LayoutHeader'],
    ['tree view folders', 'TreeList'],
    ['side sheet', 'Drawer'],
    ['description list', 'MetadataList'],
    ['split panes', 'useResizable'],
    ['treeview', 'TreeList'],
    ['lightning bolt', 'Icon'],
    ['sparkles', 'Icon'],
  ])('finds %s by another library\'s or a glyph\'s name', (query, name) => {
    const { results } = searchCatalog(query, 'en', { limit: 5 })
    expect(results[0]).toMatchObject({ name, reason: 'keyword' })
  })

  it('keeps an entry the query names ahead of a keyword match', () => {
    const { results } = searchCatalog('inline code', 'en', { limit: 5 })
    expect(results[0]).toMatchObject({ name: 'Code', reason: 'name' })
  })

  it('folds a gerund but not a past participle', () => {
    const { results } = searchCatalog('listed', 'en', { limit: 5 })
    expect(results.every(result => result.reason !== 'name')).toBe(true)
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

describe('search order among equal scores', () => {
  it('lists a family word\'s own entry, then the members that start with it', () => {
    const { results } = searchCatalog('tabs', 'en', { limit: 4, type: 'component' })
    expect(results[0]).toMatchObject({ name: 'Tab', score: 100 })
    expect(results.slice(1, 3).map(result => result.name)).toEqual(['TabList', 'TabMenu'])
    expect(results.slice(1, 3).every(result => result.reason === 'prefix' && result.score === 80)).toBe(true)
  })

  it('puts the entry that answers more of the query first, without changing scores', () => {
    const { results } = searchCatalog('date picker', 'en', { limit: 20 })
    const top = results[0]!
    expect(top).toMatchObject({ domain: 'component', name: 'DateInput', reason: 'text' })
    const tied = results.filter(result => result.score === top.score)
    expect(tied.length).toBeGreaterThan(1)
    expect(tied.map(result => result.name).indexOf('ComplexSelector')).toBeGreaterThan(0)
  })

  it('keeps members that share a name prefix in name order', () => {
    const { results } = searchCatalog('dropdownmenu', 'en', { limit: 4, type: 'component' })
    expect(results.map(result => result.name)).toEqual(['DropdownMenu', 'DropdownMenuCheckboxItem', 'DropdownMenuDivider', 'DropdownMenuGroup'])
  })

  it('orders names by code point, the same on every machine', () => {
    expect(compareText('B', 'a')).toBeLessThan(0)
    expect(compareText('Tab', 'Tab')).toBe(0)
    expect(['useTab', 'Tab', 'TabList'].sort(compareText)).toEqual(['Tab', 'TabList', 'useTab'])
  })
})

describe('search reads a name written as one word in page text', () => {
  it('finds a page by the words of a PascalCase query', async () => {
    const results = await search(['RightToLeft', '--limit', '5'])
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(result => result.reason === 'text')).toBe(true)
  })
})

describe('search reads another entry\'s name as that entry\'s evidence', () => {
  it('lists a template that only imports the named component below components and its own matches', () => {
    const { results } = searchCatalog('Avatar', 'en', { limit: 30 })
    const imports = results.filter(result => result.domain === 'template')
    expect(imports.length).toBeGreaterThan(0)
    expect(imports.every(result => result.score < 30 && result.reason === 'text')).toBe(true)
    expect(results[0]).toMatchObject({ domain: 'component', name: 'Avatar' })
  })
})

describe('keywords are words to find a component by, never names', () => {
  it('lists no keyword that is another entry\'s name', () => {
    for (const record of catalog.components)
      expect(keywordOwners(record.name).filter(slug => slug !== record.slug), record.name).toEqual([])
  })

  it('does not open a component through a keyword, and names the component to use', async () => {
    for (const [typed, expected] of [['ScrollArea', 'ScrollableArea'], ['treeview', 'TreeList'], ['splitpane', 'useResizable']]) {
      const result = await runCli(['component', typed!, '--json'])
      expect(result.exitCode, typed).toBe(1)
      const envelope = parseResponse(result.stdout)
      expect(isError(envelope)).toBe(true)
      if (!isError(envelope))
        return
      expect(envelope.code).toBe('ERR_UNKNOWN_COMPONENT')
      expect(envelope.suggestions?.[0]).toMatchObject({ name: expected, reason: 'keyword' })
    }
  })

  it('does not open a composable through a keyword either', async () => {
    const result = await runCli(['composable', 'splitpane', '--json'])
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope) && envelope.suggestions?.[0]).toMatchObject({ name: 'useResizable', reason: 'keyword' })
  })
})

describe('search match count', () => {
  it.each(['tabs', 'date picker', 'dark mode', 'RightToLeft', 'table header cell', 'qqzz_no_match_here'])('counts every match of %s whatever the limit', (query) => {
    const everything = searchCatalog(query, 'en', { limit: 10_000 })
    const few = searchCatalog(query, 'en', { limit: 3 })
    expect(everything.results.length).toBe(everything.matchCount)
    expect(few.matchCount).toBe(everything.matchCount)
    expect(few.results.map(result => result.name)).toEqual(everything.results.slice(0, 3).map(result => result.name))
  })
})

describe('a failed lookup points to the command that has the name', () => {
  async function failure(argv: string[]): Promise<{ code: string, names: string[] }> {
    const result = await runCli([...argv, '--json'])
    expect(result.exitCode).toBe(1)
    const envelope = parseResponse(result.stdout)
    expect(isError(envelope)).toBe(true)
    if (!isError(envelope))
      throw new Error('expected an error')
    return { code: envelope.code, names: (envelope.suggestions ?? []).map(item => item.name) }
  }

  it('sends a component name given to docs, template, and composable to component', async () => {
    for (const command of ['docs', 'template', 'composable']) {
      const { names } = await failure([command, 'Button'])
      expect(names[0], command).toBe('astryx-vue component Button')
    }
  })

  it('sends a template slug and a topic id given to component to their commands', async () => {
    expect((await failure(['component', 'login-card'])).names[0]).toBe('astryx-vue template login-card')
    expect((await failure(['component', 'guide/dark-mode'])).names[0]).toBe('astryx-vue docs guide/dark-mode')
    expect((await failure(['composable', 'dark-mode'])).names[0]).toBe('astryx-vue docs guide/dark-mode')
  })

  it('sends a name spelled without hyphens to the command that has it', async () => {
    expect((await failure(['component', 'logincard'])).names[0]).toBe('astryx-vue template login-card')
    expect((await failure(['docs', 'useclipboard'])).names[0]).toBe('astryx-vue composable useClipboard')
  })

  it('keeps near names after the pointer, and leaves it out when no command has the name', async () => {
    const near = await failure(['docs', 'Buttn'])
    expect(near.names.every(name => !name.startsWith('astryx-vue '))).toBe(true)
    expect((await failure(['component', 'nope'])).names.some(name => name.startsWith('astryx-vue '))).toBe(false)
  })
})

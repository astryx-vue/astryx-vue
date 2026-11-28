import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'
import { runCli } from './cli.ts'
import { assertResponse } from './envelope.ts'

interface SearchResult {
  name: string
  deprecated?: { replacement: string, description: string }
}

async function searchJson(argv: string[]): Promise<SearchResult[]> {
  const result = await runCli(['search', ...argv, '--json'])
  expect(result.exitCode).toBe(0)
  return (assertResponse(result.stdout, 'search').data as { results: SearchResult[] }).results
}

describe('废弃组件的搜索结果', () => {
  it('catalog 里带着替代组件和迁移说明', () => {
    const record = catalog.components.find(component => component.slug === 'bottom-sheet-switcher')
    expect(record?.deprecated?.replacement).toBe('BottomSheet')
    expect(record?.deprecated?.description.en).toMatch(/BottomSheet/)
    expect(record?.deprecated?.description.zh).toMatch(/BottomSheet/)
    expect(catalog.components.find(component => component.slug === 'bottom-sheet')?.deprecated).toBeUndefined()
  })

  it('--json 的结果带 deprecated 字段，没废弃的不带', async () => {
    const results = await searchJson(['bottom sheet', '--limit', '20'])
    const switcher = results.find(result => result.name === 'BottomSheetSwitcher')
    expect(switcher?.deprecated?.replacement).toBe('BottomSheet')
    expect(switcher?.deprecated?.description).toMatch(/BottomSheet/)
    expect(results.find(result => result.name === 'BottomSheet')).not.toHaveProperty('deprecated')
  })

  it('文字输出标出已废弃并给出替代组件', async () => {
    const result = await runCli(['search', 'bottom sheet switcher', '--limit', '3'])
    expect(result.stdout).toMatch(/BottomSheetSwitcher \(deprecated\)/)
    expect(result.stdout).toMatch(/Deprecated, use BottomSheet: /)
    const zh = await runCli(['search', 'bottom sheet switcher', '--limit', '3', '--zh'])
    expect(zh.stdout).toMatch(/BottomSheetSwitcher（已废弃）/)
    expect(zh.stdout).toMatch(/已废弃，改用 BottomSheet：/)
  })
})

describe('build 列出的废弃组件', () => {
  it('文字输出和 --json 都带上废弃信息', async () => {
    const text = await runCli(['build', 'bottom sheet switcher steps'])
    expect(text.stdout).toMatch(/BottomSheetSwitcher \(deprecated\)/)
    expect(text.stdout).toMatch(/Deprecated, use BottomSheet: /)
    const json = await runCli(['build', 'bottom sheet switcher steps', '--json'])
    const data = assertResponse(json.stdout, 'build.kit').data as { components: Array<{ name: string, deprecated?: { replacement: string } }> }
    expect(data.components.find(item => item.name === 'BottomSheetSwitcher')?.deprecated?.replacement).toBe('BottomSheet')
  })
})

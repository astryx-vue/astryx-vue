// pnpm a11y 的纯逻辑：页面清单、违规汇总、已知问题名单判定。不开浏览器。
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseA11yArgs } from '../scripts/swarm/a11y-scan/args.mjs'
import { collectIssues, compareWithKnown, describeComparison, issueKey, seedKnown, tightenKnown } from '../scripts/swarm/a11y-scan/baseline.mjs'
import { pageUrl, readDemoMetas, readSlug, selectSlugs, slugsFromMetas } from '../scripts/swarm/a11y-scan/pages.mjs'
import { buildReportMd, slimViolation, summarizeScan } from '../scripts/swarm/a11y-scan/report.mjs'

const ROOT = join(__dirname, '..')

function violation(id: string, impact = 'serious', nodes = 1) {
  return { id, impact, help: `${id} help`, helpUrl: `https://x/${id}`, nodeCount: nodes, nodes: [] }
}

function page(slug: string, scheme: string, ids: string[], error?: string) {
  return { slug, scheme, demos: 1, violations: ids.map(id => violation(id)), ...(error ? { error } : {}) }
}

describe('页面清单', () => {
  it('从 meta.ts 读出 slug，不执行它', () => {
    expect(readSlug(`import x from './index'\nexport const meta = { slug: 'dropdown-menu', group: 'Action' }`)).toBe('dropdown-menu')
    expect(() => readSlug('export const meta = {}')).toThrow('找不到 slug')
  })

  it('排序，重复的 slug 直接报错', () => {
    expect(slugsFromMetas([{ dir: 'b', source: `slug: 'b'` }, { dir: 'a', source: `slug: 'a'` }])).toEqual(['a', 'b'])
    expect(() => slugsFromMetas([{ dir: 'a', source: `slug: 'x'` }, { dir: 'b', source: `slug: 'x'` }])).toThrow('slug x 重复')
    expect(() => slugsFromMetas([{ dir: 'a', source: 'nothing' }])).toThrow('a/meta.ts')
  })

  it('仓库里每个组件文档页都在清单里', () => {
    const slugs = slugsFromMetas(readDemoMetas(ROOT))
    expect(slugs.length).toBeGreaterThan(200)
    expect(slugs).toContain('button')
    expect(slugs).toContain('switch')
  })

  it('页面地址和 --only 过滤', () => {
    expect(pageUrl('http://localhost:5172/', 'button')).toBe('http://localhost:5172/en/components/button/')
    expect(selectSlugs(['a', 'b', 'c'], undefined)).toEqual(['a', 'b', 'c'])
    expect(selectSlugs(['a', 'b', 'c'], ['c', 'a'])).toEqual(['a', 'c'])
    expect(() => selectSlugs(['a'], ['z'])).toThrow('没有这些组件页：z')
  })
})

describe('参数', () => {
  it('默认扫两种模式、起服务', () => {
    expect(parseA11yArgs([])).toMatchObject({ schemes: ['light', 'dark'], serve: true, update: false, concurrency: 2 })
    expect(parseA11yArgs(['--only', 'button,switch', '--schemes', 'dark'])).toMatchObject({ only: ['button', 'switch'], schemes: ['dark'] })
    expect(parseA11yArgs(['--ours', 'http://localhost:5173'])).toMatchObject({ serve: false, oursOrigin: 'http://localhost:5173' })
  })

  it('拒绝错误参数', () => {
    expect(() => parseA11yArgs(['--schemes', 'sepia'])).toThrow('--schemes')
    expect(() => parseA11yArgs(['--update', '--init'])).toThrow('不能同时用')
    expect(() => parseA11yArgs(['button'])).toThrow('不认识的参数')
  })
})

describe('违规汇总', () => {
  it('只留需要的字段，节点最多 5 个', () => {
    const raw = { id: 'button-name', impact: 'critical', help: 'h', helpUrl: 'u', nodes: Array.from({ length: 7 }, (_, i) => ({ target: [`#b${i}`], failureSummary: 'Fix any of the following:\n  Element has no text' })) }
    const slim = slimViolation(raw)
    expect(slim).toMatchObject({ id: 'button-name', impact: 'critical', nodeCount: 7 })
    expect(slim.nodes).toHaveLength(5)
    expect(slim.nodes[0]).toEqual({ target: ['#b0'], summary: 'Fix any of the following: Element has no text' })
  })

  it('按影响、规则、组件统计，并找出深色独有的问题', () => {
    const pages = [
      page('button', 'light', ['color-contrast']),
      page('button', 'dark', ['color-contrast', 'link-name']),
      page('switch', 'light', []),
      page('switch', 'dark', ['color-contrast']),
      page('tabs', 'light', [], '超时'),
    ]
    const summary = summarizeScan(pages)
    expect(summary).toMatchObject({ pages: 3, scans: 5, violations: 4, byScheme: { light: 1, dark: 3 } })
    expect(summary.byImpact).toEqual({ critical: 0, serious: 4, moderate: 0, minor: 0 })
    expect(summary.byRule.map(rule => [rule.id, rule.count])).toEqual([['color-contrast', 3], ['link-name', 1]])
    expect(summary.byComponent[0]).toEqual({ slug: 'button', count: 3, rules: ['color-contrast', 'link-name'] })
    expect(summary.darkOnly).toEqual(['button link-name', 'switch color-contrast'])
    expect(summary.lightOnly).toEqual([])
    expect(summary.failedScans).toEqual([{ slug: 'tabs', scheme: 'light', error: '超时' }])
    const md = buildReportMd({ origin: 'o', include: '.astryx-demo', schemes: ['light', 'dark'], tags: ['all'], axeVersion: '4', finishedAt: 't', summary, comparison: null })
    expect(md).toContain('| `color-contrast` | serious | 3 | 2 |')
    expect(md).toContain('扫描失败 1 次')
  })
})

describe('已知问题名单', () => {
  const pages = [page('button', 'light', ['button-name']), page('button', 'dark', ['button-name', 'color-contrast']), page('switch', 'light', []), page('switch', 'dark', [])]
  const issues = collectIssues(pages)
  const all = ['button', 'switch', 'tabs']

  it('按「组件 规则」去重，记下出现在哪些模式', () => {
    expect([...issues.keys()]).toEqual([issueKey('button', 'button-name'), issueKey('button', 'color-contrast')])
    expect([...issues.get('button button-name')!]).toEqual(['light', 'dark'])
    expect(seedKnown(issues)).toEqual({ 'button button-name': '基线：dark、light', 'button color-contrast': '基线：dark' })
  })

  it('名单外的新违规算新增，点名组件和规则', () => {
    const result = compareWithKnown(issues, { 'button color-contrast': 'x' }, { scannedSlugs: ['button', 'switch'], allSlugs: all, bothSchemes: true })
    expect(result.added).toEqual(['button button-name'])
    expect(describeComparison(result)).toContain('+ button button-name')
  })

  it('名单里不再出现的条目算消失', () => {
    const known = { 'button button-name': 'x', 'button color-contrast': 'x', 'switch color-contrast': 'x' }
    const result = compareWithKnown(issues, known, { scannedSlugs: ['button', 'switch'], allSlugs: all, bothSchemes: true })
    expect(result).toEqual({ added: [], resolved: ['switch color-contrast'], kept: ['button button-name', 'button color-contrast'] })
    expect(describeComparison(result)).toContain('- switch color-contrast')
  })

  it('没扫到的页、只扫了一种模式时，不判定消失；页面已经删掉的条目算消失', () => {
    const known = { 'tabs color-contrast': 'x', 'switch color-contrast': 'x', 'gone link-name': 'x' }
    expect(compareWithKnown(issues, known, { scannedSlugs: ['button', 'switch'], allSlugs: all, bothSchemes: true }).resolved).toEqual(['gone link-name', 'switch color-contrast'])
    expect(compareWithKnown(issues, known, { scannedSlugs: ['button', 'switch'], allSlugs: all, bothSchemes: false }).resolved).toEqual(['gone link-name'])
  })

  it('--update 只删不加', () => {
    const known = { 'switch color-contrast': 'a', 'button button-name': 'b' }
    const tightened = tightenKnown(known, ['switch color-contrast'])
    expect(tightened).toEqual({ 'button button-name': 'b' })
    expect(Object.keys(tightened)).not.toContain('button color-contrast')
  })

  it('仓库里的名单键都是「slug 规则」，并且按字母排好', () => {
    const known: Record<string, string> = JSON.parse(readFileSync(join(ROOT, 'scripts/guardrails/a11y-known-issues.json'), 'utf8'))
    const keys = Object.keys(known)
    expect(keys.every(key => /^[a-z0-9-]+ [a-z0-9-]+$/.test(key))).toBe(true)
    expect(keys).toEqual([...keys].sort())
    const slugs = slugsFromMetas(readDemoMetas(ROOT))
    expect(keys.filter(key => !slugs.includes(key.split(' ')[0]!))).toEqual([])
  })
})

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { formatIcu, icuArgumentKinds } from '../packages/core/src/locale/icu.ts'
import {
  checkBuiltInParity,
  checkBuiltInPlaceholders,
  checkCoverage,
  checkEnglishText,
  checkLocaleContracts,
  checkMapTargets,
  checkSourceRefs,
} from '../scripts/i18n-catalog/checks.mjs'

const icu = { argumentKinds: icuArgumentKinds, format: formatIcu }
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

const enCatalog = {
  '@astryx.demo.clear': { defaultMessage: 'Clear {label}' },
  '@astryx.demo.count': { defaultMessage: '{count, number} {count, plural, one {result} other {results}}' },
  '@astryx.demo.close': { defaultMessage: 'Close' },
}

const map = {
  '@astryx.demo.clear': [{ path: 'demo.clear', args: ['label'] }],
  '@astryx.demo.count': [{ path: 'demo.count', args: ['count'] }],
  '@astryx.demo.close': [{ path: 'demo.close' }],
}

const en = {
  demo: {
    clear: (label: string) => `Clear ${label}`,
    count: (count: number) => `${new Intl.NumberFormat('en').format(count)} ${count === 1 ? 'result' : 'results'}`,
    close: 'Close',
  },
}

const zh = {
  demo: {
    clear: (label: string) => `清除${label}`,
    count: (count: number) => `${count} 个结果`,
    close: '关闭',
  },
}

describe('checkBuiltInParity', () => {
  it('passes when en and zh-CN have the same fields', () => {
    expect(checkBuiltInParity(en, zh)).toEqual([])
  })

  it('reports a field that zh-CN is missing', () => {
    const broken = { demo: { clear: zh.demo.clear, count: zh.demo.count } }
    expect(checkBuiltInParity(en, broken)).toEqual(['demo.close：zh-CN 缺这个字段'])
  })

  it('reports a field whose shape differs or that is empty', () => {
    const broken = { demo: { ...zh.demo, clear: '清除', close: ' ' } }
    const problems = checkBuiltInParity(en, broken)
    expect(problems.some(problem => problem.startsWith('demo.clear：en 是函数'))).toBe(true)
    expect(problems).toContain('demo.close：zh-CN 是空字符串')
  })
})

describe('checkMapTargets', () => {
  it('passes for a consistent map', () => {
    expect(checkMapTargets(map, enCatalog, en, icu)).toEqual([])
  })

  it('reports an upstream key that the catalog does not have', () => {
    const problems = checkMapTargets({ '@astryx.demo.gone': [{ path: 'demo.close' }] }, enCatalog, en, icu)
    expect(problems).toEqual(['@astryx.demo.gone：映射里有，但 locales/en.json 里没有这个键'])
  })

  it('reports a missing field and args that do not match the placeholders', () => {
    const problems = checkMapTargets({
      '@astryx.demo.clear': [{ path: 'demo.clear', args: ['name'] }, { path: 'demo.nope', args: ['label'] }],
    }, enCatalog, en, icu)
    expect(problems).toContain('@astryx.demo.clear → demo.clear：args 是 [name]，原文的占位符是 [label]')
    expect(problems).toContain('@astryx.demo.clear → demo.nope：文案树里没有这个字段')
  })
})

describe('checkBuiltInPlaceholders', () => {
  it('passes when every placeholder reaches the text', () => {
    expect(checkBuiltInPlaceholders(map, { 'en': en, 'zh-CN': zh }, enCatalog, icu)).toEqual([])
  })

  it('reports a zh-CN message that drops a placeholder', () => {
    const broken = { demo: { ...zh.demo, clear: () => '清除' } }
    const problems = checkBuiltInPlaceholders(map, { 'zh-CN': broken }, enCatalog, icu)
    expect(problems).toEqual(['zh-CN demo.clear：没有用上占位符 label（对应 @astryx.demo.clear）'])
  })
})

describe('checkEnglishText', () => {
  it('passes when the built-in English matches upstream for one, few, and thousands', () => {
    expect(checkEnglishText(map, en, enCatalog, icu)).toEqual([])
  })

  it('reports wording drift and a missing thousands separator', () => {
    const drifted = { demo: { ...en.demo, close: 'Dismiss', count: (count: number) => `${count} results` } }
    const problems = checkEnglishText(map, drifted, enCatalog, icu)
    expect(problems).toContain('@astryx.demo.close → demo.close：内置英文是 "Dismiss"，原版是 "Close"')
    expect(problems.some(problem => problem.startsWith('@astryx.demo.count → demo.count'))).toBe(true)
  })
})

describe('checkLocaleContracts', () => {
  it('accepts reordered placeholders and locale-specific plural branches', () => {
    const catalogs = {
      'zh-CN': {
        '@astryx.demo.clear': { defaultMessage: '清除 {label}' },
        '@astryx.demo.count': { defaultMessage: '{count, number} {count, plural, other {个结果}}' },
      },
    }
    const result = checkLocaleContracts(enCatalog, catalogs, icu)
    expect(result.problems).toEqual([])
    expect(result.untranslated).toEqual({ 'zh-CN': 1 })
  })

  it('reports a renamed placeholder, a changed kind, a stale key, and a syntax error', () => {
    const catalogs = {
      fr: {
        '@astryx.demo.clear': { defaultMessage: 'Effacer {name}' },
        '@astryx.demo.count': { defaultMessage: '{count} résultats' },
        '@astryx.demo.close': { defaultMessage: 'Fermer {' },
        '@astryx.demo.old': { defaultMessage: 'Ancien' },
      },
    }
    const { problems } = checkLocaleContracts(enCatalog, catalogs, icu)
    expect(problems).toContain('fr.json @astryx.demo.clear：占位符是 name:argument，英文原文是 label:argument')
    expect(problems).toContain('fr.json @astryx.demo.count：占位符是 count:argument，英文原文是 count:number+plural')
    expect(problems.some(problem => problem.startsWith('fr.json @astryx.demo.close：解析失败'))).toBe(true)
    expect(problems).toContain('fr.json @astryx.demo.old：en.json 里没有这个键，是过期的译文')
  })
})

describe('checkCoverage', () => {
  it('counts keys of an unported namespace and reports any other unmapped key', () => {
    const catalog = { ...enCatalog, '@astryx.lab.one': { defaultMessage: 'One' }, '@astryx.newThing.label': { defaultMessage: 'New' } }
    const result = checkCoverage(catalog, map, { lab: 'not ported yet' })
    expect(result.skipped.get('lab')).toBe(1)
    expect(result.problems).toEqual(['@astryx.newThing.label：既没写进 upstreamMap，也不在 scripts/i18n-catalog/coverage.mjs 的暂不接入名单里'])
  })
})

describe('checkSourceRefs', () => {
  it('reports a translator call whose key is not mapped', () => {
    const files = [{ path: 'Demo.vue', text: 'const a = t(\'@astryx.demo.close\')\nconst b = t("@astryx.demo.typo")' }]
    const result = checkSourceRefs(files, map)
    expect(result.count).toBe(2)
    expect(result.problems).toEqual(['Demo.vue:2  @astryx.demo.typo 不在 upstreamMap 里'])
  })
})

describe('check-i18n-catalog script', () => {
  it('passes on the repository as it is', () => {
    const output = execFileSync(process.execPath, ['scripts/check-i18n-catalog.mjs'], { cwd: rootDir, encoding: 'utf8' })
    expect(output).toContain('check:i18n-catalog 通过')
  })
})

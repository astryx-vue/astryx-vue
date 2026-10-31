import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { formatIcu, icuArgumentKinds } from './icu.js'
import { provideAstryxLocale, useAstryxLocale, useAstryxMessages, useCollator } from './index.js'
import { loadAstryxCatalog } from './loadCatalog.js'
import { astryxMessages } from './messages.js'

const localesDir = join(dirname(fileURLToPath(import.meta.url)), '../../locales')

function readCatalog(tag: string) {
  return JSON.parse(readFileSync(join(localesDir, `${tag}.json`), 'utf8')) as Record<string, { defaultMessage: string }>
}

describe('icu', () => {
  it('formats numbers, plurals, and select', () => {
    expect(formatIcu('Clear {label}', { label: 'Name' }, 'en')).toBe('Clear Name')
    expect(formatIcu('Clear {label}', {}, 'en')).toBe('Clear ')
    expect(formatIcu('{count, number} {count, plural, one {result} other {results}}', { count: 1 }, 'en')).toBe('1 result')
    expect(formatIcu('{count, number} {count, plural, one {result} other {results}}', { count: 2 }, 'en')).toBe('2 results')
    expect(formatIcu('It\'\'s {name}', { name: 'A' }, 'en')).toBe('It\'s A')
    expect(formatIcu('{boundary, select, first {first} last {last} other {}}', { boundary: 'last' }, 'en')).toBe('last')
    expect(formatIcu('{count, plural, offset:1 other {# more}}', { count: 3 }, 'en')).toBe('2 more')
  })

  it('keeps a lone apostrophe as text and only quotes before syntax characters', () => {
    expect(formatIcu('Kies \'n datum vir {label}', { label: 'X' }, 'af-ZA')).toBe('Kies \'n datum vir X')
    expect(formatIcu('Actions for {name}\'s comment', { name: 'Ana' }, 'en')).toBe('Actions for Ana\'s comment')
    expect(formatIcu('\'{literal}\' {value}', { value: 'v' }, 'en')).toBe('{literal} v')
    expect(icuArgumentKinds('{count, number} {count, plural, one {# x} other {# xs}} {name}')).toEqual({
      count: ['number', 'plural'],
      name: ['argument'],
    })
  })

  it('uses Arabic plural categories', () => {
    const message = '{count, plural, zero {صفر} one {واحد} two {اثنان} few {قليل} many {كثير} other {آخر}}'
    expect(formatIcu(message, { count: 0 }, 'ar-SA')).toBe('صفر')
    expect(formatIcu(message, { count: 1 }, 'ar-SA')).toBe('واحد')
    expect(formatIcu(message, { count: 2 }, 'ar-SA')).toBe('اثنان')
    expect(formatIcu(message, { count: 3 }, 'ar-SA')).toBe('قليل')
    expect(formatIcu(message, { count: 11 }, 'ar-SA')).toBe('كثير')
  })
})

describe('loadAstryxCatalog', () => {
  const tags = readdirSync(localesDir).filter(name => name.endsWith('.json') && name !== 'SOURCE.json').map(name => name.replace(/\.json$/, '')).sort()

  it('vendors the upstream locale files', () => {
    const source = JSON.parse(readFileSync(join(localesDir, 'SOURCE.json'), 'utf8')) as { commit: string, files: string[] }
    expect(source.commit).toMatch(/^[0-9a-f]{40}$/)
    expect(tags).toHaveLength(30)
    expect(source.files).toEqual(tags.map(tag => `${tag}.json`))
    expect(tags).toContain('en')
    expect(tags).toContain('zh-CN')
    expect(tags).toContain('zh-TW')
    expect(tags).toContain('ja-JP')
    expect(tags).toContain('ar-SA')
  })

  it('accounts for every English key and does not mutate the built-in catalogs', () => {
    const before = astryxMessages.en.selector.placeholder
    const catalog = readCatalog('en')
    const loaded = loadAstryxCatalog('en', catalog)
    const keys = Object.keys(catalog).sort()
    const unmappedKeys = loaded.unmapped.map(entry => entry.key)
    const mappedKeys = keys.filter(key => !unmappedKeys.includes(key))

    expect(astryxMessages.en.selector.placeholder).toBe(before)
    expect(loaded.missingKeys).toEqual([])
    expect(loaded.unmapped.some(entry => entry.reason === 'unsupported-message')).toBe(false)
    expect(loaded.unmapped.some(entry => entry.reason === 'placeholder-mismatch')).toBe(false)
    expect(loaded.unmapped.some(entry => entry.reason === 'slot-taken')).toBe(false)
    expect(new Set([...mappedKeys, ...unmappedKeys])).toEqual(new Set(keys))
    expect(mappedKeys.length + unmappedKeys.length).toBe(keys.length)
    // 用还没接入的命名空间举例：lab 输入类和富文本编辑器的键已经在 upstreamMap 里了。
    expect(unmappedKeys).toContain('@astryx.diffViewer.label')
    expect(unmappedKeys).not.toContain('@astryx.richTextEditor.toolbar.bold')
    expect(unmappedKeys).not.toContain('@astryx.pagination.previous')
    for (const entry of loaded.unmapped)
      expect(entry.message).toBe(catalog[entry.key]!.defaultMessage)
    expect(loaded.fallbackFields).toContain('pagination.compact')
    expect(loaded.fallbackFields).not.toContain('pagination.previous')
    expect(loaded.messages.pagination.previous).toBe('Go to previous page')
    expect(loaded.messages.pagination.total(10, 1, 10)).toBe('1–10 of 10')
    expect(loaded.messages.numberInput.increment(undefined)).toBe('Increment')
    expect(loaded.messages.numberInput.increment('Name')).toBe('Increment Name')
  })

  it('loads Japanese and Arabic without dropping keys', () => {
    for (const tag of tags) {
      const catalog = readCatalog(tag)
      const loaded = loadAstryxCatalog(tag, catalog)
      const keys = Object.keys(catalog)
      expect(loaded.unmapped.map(entry => entry.key).sort()).toEqual([...new Set(loaded.unmapped.map(entry => entry.key))].sort())
      expect(loaded.unmapped.length + keys.filter(key => !loaded.unmapped.some(entry => entry.key === key)).length).toBe(keys.length)
      expect(loaded.unmapped.some(entry => entry.reason === 'unsupported-message')).toBe(false)
      for (const entry of loaded.unmapped)
        expect(entry.message).toBe(catalog[entry.key]!.defaultMessage)
    }

    const japanese = loadAstryxCatalog('ja-JP', readCatalog('ja-JP'))
    expect(japanese.messages.pagination.previous).toBe('前のページへ')
    expect(japanese.messages.calendar.previousMonth).toBe('前月')
    expect(japanese.messages.selector.resultCount(1)).toBe('1 件の結果')
    expect(japanese.missingKeys.length).toBeGreaterThan(0)

    const arabic = loadAstryxCatalog('ar-SA', readCatalog('ar-SA'))
    expect(arabic.messages.selector.resultCount(1)).toContain('نتيجة')
    expect(arabic.messages.selector.resultCount(0)).not.toBe(arabic.messages.selector.resultCount(1))
  })

  it('provides loaded messages and a locale-aware collator', () => {
    const loaded = loadAstryxCatalog('ja-JP', readCatalog('ja-JP'))
    const Probe = defineComponent({
      setup() {
        const locale = useAstryxLocale()
        const messages = useAstryxMessages()
        const collator = useCollator({ numeric: true })
        return () => h('span', [
          locale.value,
          '|',
          messages.value.pagination.previous,
          '|',
          String(collator.value.compare('item2', 'item10') < 0),
          '|',
          collator.value.resolvedOptions().locale,
        ].join(''))
      },
    })
    const Parent = defineComponent({
      setup() {
        provideAstryxLocale('ja-jp', loaded.messages)
        return () => h(Probe)
      },
    })
    const text = mount(Parent).text()
    expect(text.startsWith('ja-JP|前のページへ|true|')).toBe(true)
    expect(text.toLowerCase()).toContain('ja')
  })

  it('keeps English copy when an extra locale has no messages', () => {
    const Probe = defineComponent({
      setup() {
        const locale = useAstryxLocale()
        const messages = useAstryxMessages()
        return () => h('span', `${locale.value}|${messages.value.selector.placeholder}`)
      },
    })
    const Parent = defineComponent({
      setup() {
        provideAstryxLocale('zh-TW')
        return () => h(Probe)
      },
    })
    expect(mount(Parent).text()).toBe('zh-TW|Select…')
  })
})

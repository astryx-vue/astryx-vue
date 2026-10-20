import type { Catalog, ComponentRecord, ExampleRecord } from './catalog-types.ts'
import catalogJson from './generated/catalog.json' with { type: 'json' }

export const catalog = catalogJson as Catalog

export function localeOf(zh: boolean): 'en' | 'zh' {
  return zh ? 'zh' : 'en'
}

export function text(record: { en: string, zh: string }, locale: 'en' | 'zh'): string {
  return record[locale] || record.en
}

/**
 * The only place that turns the stored examples into one language's records.
 * Titles and descriptions are picked by locale; the code is shared and copied as
 * is, so a caller can never end up with the other language's text.
 */
export function examplesFor(component: ComponentRecord, locale: 'en' | 'zh'): ExampleRecord[] {
  return component.examples.map(example => ({
    title: example.title[locale],
    description: example.description[locale],
    code: example.code,
  }))
}

export function componentNames(component: ComponentRecord): string[] {
  return [
    component.name,
    component.slug,
    component.title.en,
    component.title.zh,
    component.exportName ?? '',
    component.name.replace(/([a-z])([A-Z])/g, '$1-$2'),
  ].filter(Boolean)
}

import type { Catalog, ComponentRecord } from './catalog-types.ts'
import catalogJson from './generated/catalog.json' with { type: 'json' }

export const catalog = catalogJson as Catalog

export function localeOf(zh: boolean): 'en' | 'zh' {
  return zh ? 'zh' : 'en'
}

export function text(record: { en: string, zh: string }, locale: 'en' | 'zh'): string {
  return record[locale] || record.en
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

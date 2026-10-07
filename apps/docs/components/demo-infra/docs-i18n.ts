export type DocsLocale = 'en' | 'zh'

export function localePath(locale: DocsLocale, path: string): string {
  return locale === 'en' ? `/en${path}` : path
}

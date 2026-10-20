import type { LocaleText } from '../../catalog-types.ts'

/**
 * Keywords are what a person would type, not what the page is called: a login
 * card answers to "sign in", a dashboard to "KPI" and "后台". Keep both
 * languages, because `build` matches an idea against every template regardless
 * of `--zh`, and the reply is the only localized part.
 */
export interface TemplateMeta {
  description: LocaleText
  keywords: { en: string[], zh: string[] }
  /** Used when the playground manifest has no category for the page. */
  category?: LocaleText
}

import type { DocsLocale } from './docs-i18n'

/**
 * Lab 组件跟原版一样，不进顶部导航。
 * 它们挂在组件侧栏底部、按包收成一组，显示名是 Lab。
 * 顺序按英文名，和原版侧栏的 localeCompare 一致。
 */
export const LAB_COMPONENTS = [
  { slug: 'circular-progress', en: 'CircularProgress', zh: 'CircularProgress' },
  { slug: 'info-tip', en: 'InfoTip', zh: 'InfoTip' },
  { slug: 'list-input', en: 'ListInput', zh: 'ListInput' },
  { slug: 'log-stream', en: 'LogStream', zh: 'LogStream' },
  { slug: 'mobile-tokenizer', en: 'MobileTokenizer', zh: 'MobileTokenizer' },
  { slug: 'stat', en: 'Stat', zh: 'Stat' },
  { slug: 'svg-icon', en: 'SVGIcon', zh: 'SVGIcon' },
  { slug: 'transfer-list', en: 'TransferList', zh: 'TransferList' },
] as const

export type LabSlug = (typeof LAB_COMPONENTS)[number]['slug']

export function labComponentLabel(locale: DocsLocale, slug: LabSlug): string {
  const entry = LAB_COMPONENTS.find(item => item.slug === slug)
  return entry === undefined ? slug : entry[locale]
}

import type { CatalogEntry } from './demoMeta'
import { componentDocsCopy } from './docs-i18n'

/**
 * 站内搜索的结果行由 KawaPress 搜索插件渲染，行上只有链接。这里按链接给废弃组件的每一行
 * 补一个「已废弃」标记：有上级路径（「Bottom Sheet Switcher › 用法」）时跟在路径后面，
 * 没有时跟在标题后面。中英文按页面语言取文案。
 */
export function deprecatedSearchRowCss(entries: readonly CatalogEntry[]): string {
  const slugs = entries.filter(entry => entry.deprecated !== undefined).map(entry => entry.slug)
  if (slugs.length === 0)
    return ''
  const rows = slugs.flatMap(slug => [
    `.kawa-search-result[href$="/components/${slug}"]`,
    `.kawa-search-result[href*="/components/${slug}#"]`,
    `.kawa-search-result[href*="/components/${slug}/"]`,
  ])
  const marker = (row: string): string[] => [
    `${row} .kawa-search-result__path::after`,
    `${row}:not(:has(.kawa-search-result__path)) .kawa-search-result__title::after`,
  ]
  const label = (text: string): string => `'${text.replace(/'/g, '\\\'')}'`
  return [
    `${rows.flatMap(marker).join(',\n')} {`,
    `  content: ' · ' var(--docs-deprecated-search-label);`,
    `  color: var(--astryx-text-muted);`,
    `}`,
    `:root { --docs-deprecated-search-label: ${label(componentDocsCopy.zh.deprecated)}; }`,
    `:root:lang(en) { --docs-deprecated-search-label: ${label(componentDocsCopy.en.deprecated)}; }`,
  ].join('\n')
}

const STYLE_ID = 'docs-deprecated-search-rows'

/** 在浏览器里挂上这段样式；搜索只在浏览器里打开，服务端不需要。 */
export function installDeprecatedSearchRows(entries: readonly CatalogEntry[]): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID) !== null)
    return
  const css = deprecatedSearchRowCss(entries)
  if (css === '')
    return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = css
  document.head.append(style)
}

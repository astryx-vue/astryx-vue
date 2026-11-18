/**
 * 主题相关页面的源文件和网址分开放。
 *
 * 源文件仍在 `docs/<locale>/themes/` 下（CLI 的 `theme`、`docs` 命令按这个目录读），
 * 但原版的「主题」导航只有一个画廊页，主题怎么用、各套主题和 Foundations 都在文档侧栏里。
 * 所以这些页面改写到 `/guide/` 下，`/themes/` 留给画廊页（源文件 `themes-gallery.md`）。
 *
 * 键是 `themes/` 下的页面 id，值是改写后相对语言根目录的路径（不带 `.md`）。
 */
export const THEME_PAGE_ROUTES: Readonly<Record<string, string>> = Object.freeze({
  'index': 'guide/theming',
  'extending': 'guide/extending-themes',
  'tokens': 'guide/tokens',
  'css-variables': 'guide/css-variables',
  'color': 'guide/color',
  'typography': 'guide/typography',
  'motion': 'guide/motion',
  'scale': 'guide/scale',
  'neutral': 'guide/themes/neutral',
  'butter': 'guide/themes/butter',
  'chocolate': 'guide/themes/chocolate',
  'gothic': 'guide/themes/gothic',
  'matcha': 'guide/themes/matcha',
  'stone': 'guide/themes/stone',
  'y2k': 'guide/themes/y2k',
})

/** 页面 id 对应的网址路径，不带语言前缀，比如 `tokens` → `/guide/tokens`。没登记的 id 原样留在 `/themes/` 下。 */
export function themePagePath(id: string): string {
  const route = THEME_PAGE_ROUTES[id]
  if (route)
    return `/${route}`
  return id === 'index' ? '/themes' : `/themes/${id}`
}

/** 给 KawaPress `rewrites` 用的规则：两种语言的主题源文件，加上画廊页。必须排在通配规则前面。 */
export function themeRewrites(): Record<string, string> {
  const rules: Record<string, string> = {
    'zh/themes-gallery.md': 'themes/index.md',
    'en/themes-gallery.md': 'en/themes/index.md',
  }
  for (const [id, route] of Object.entries(THEME_PAGE_ROUTES)) {
    rules[`zh/themes/${id}.md`] = `${route}.md`
    rules[`en/themes/${id}.md`] = `en/${route}.md`
  }
  return rules
}

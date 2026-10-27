// 生成样式汇总 `packages/core/styles.css` 和每套主题的入口 `packages/themes/<name>.css`。
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { compareName } from './source-layout.mjs'

const CSS_BANNER = '/* 这个文件由 `pnpm sync` 生成，不要手改。 */\n'

// 各主题入口都先引入两份共用样式：fonts.css 是字体，data.css 是数据可视化配色的默认值。
// 数据配色只在 :root 声明一次，主题只写自己改动的那几档，嵌套主题不会把外层的改动盖回默认值。
// 以后新增主题时，生成的入口同样加上这两行。
const THEME_SHARED_IMPORTS = [
  '@import \'./fonts.css\';',
  '@import \'./data.css\';',
]

// 这些样式由组件单文件直接引入，styles.css 原来没有汇总。新的 css 会自动汇总。
// scrollbars.css 只在 ScrollbarsProvider 里引入，不汇总进 styles.css，
// 免得没开自绘滚动条的用户也带上 overlayscrollbars 的样式。
const STYLE_FILE_OMISSIONS = new Set([
  'calendar.css',
  'date-input.css',
  'input-group.css',
  'number-input.css',
  'pagination.css',
  'scrollbars.css',
  'selector.css',
  'visually-hidden-utility.css',
])

function compareCssFile(a, b) {
  const aStem = a.replace(/\.css$/, '')
  const bStem = b.replace(/\.css$/, '')
  return compareName(aStem, bStem) || compareName(a, b)
}

function cssImports(dir, specifierPrefix, omissions) {
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.css'))
    .filter(name => !omissions.has(name))
    .sort(compareCssFile)
    .map(name => `@import '${specifierPrefix}${name}';`)
}

function renderCss(dir, specifierPrefix, omissions, prelude = []) {
  const imports = [...prelude, ...cssImports(dir, specifierPrefix, omissions)]
  return `${CSS_BANNER}${imports.join('\n')}\n`
}

function themeStylesheetDirs(rootDir) {
  const themesDir = join(rootDir, 'packages/themes')
  if (!existsSync(themesDir))
    return []
  return readdirSync(themesDir)
    .filter(name => statSync(join(themesDir, name)).isDirectory())
    .filter(name => readdirSync(join(themesDir, name)).some(entry => entry.endsWith('.css')))
    .sort(compareName)
}

/** `packages/core/styles.css` 的路径和内容。 */
export function renderCoreStyles(rootDir) {
  return [
    join(rootDir, 'packages/core/styles.css'),
    renderCss(join(rootDir, 'packages/core/styles'), './styles/', STYLE_FILE_OMISSIONS),
  ]
}

/** 每套主题入口的 `[路径, 内容]`，按主题名排序。 */
export function renderThemeEntries(rootDir) {
  return themeStylesheetDirs(rootDir).map(name => [
    join(rootDir, 'packages/themes', `${name}.css`),
    renderCss(join(rootDir, 'packages/themes', name), `./${name}/`, new Set(), THEME_SHARED_IMPORTS),
  ])
}

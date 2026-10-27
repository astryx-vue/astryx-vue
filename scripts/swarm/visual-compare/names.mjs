/**
 * 组件名、URL、截图组合和输出路径的统一来源。
 *
 * 上游用 PascalCase：`/components/DropdownMenu`；
 * 我们用 kebab-case slug：`/en/components/dropdown-menu`。
 */
import { join } from 'node:path'

export const UPSTREAM_ORIGIN = 'https://astryx.atmeta.com'
export const OURS_PORT = 5172
export const OURS_ORIGIN = `http://localhost:${OURS_PORT}`

/** 不能靠大小写规则互转的名字。键是上游名，值是我们的 slug。 */
export const NAME_EXCEPTIONS = Object.freeze({
  DropdownMenuSubMenu: 'dropdown-menu-submenu',
})

const SLUG_TO_NAME = Object.freeze(
  Object.fromEntries(Object.entries(NAME_EXCEPTIONS).map(([name, slug]) => [slug, name])),
)

/** `DropdownMenu` → `dropdown-menu`，`HStack` → `h-stack`，`useClipboard` → `use-clipboard`。 */
export function toSlug(name) {
  if (NAME_EXCEPTIONS[name])
    return NAME_EXCEPTIONS[name]
  if (name.includes('-') || name === name.toLowerCase())
    return name.toLowerCase()
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/** 接受上游名或我们的 slug，统一换成上游名：`dropdown-menu` → `DropdownMenu`，`use-clipboard` → `useClipboard`。 */
export function toUpstreamName(input) {
  const slug = toSlug(input)
  if (SLUG_TO_NAME[slug])
    return SLUG_TO_NAME[slug]
  if (/[A-Z]/.test(input) && !input.includes('-'))
    return input
  const pascal = slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  return slug.startsWith('use-') ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : pascal
}

/** 两边页面地址。`oursOrigin` 末尾的斜杠会被去掉。 */
export function componentUrls(input, { upstreamOrigin = UPSTREAM_ORIGIN, oursOrigin = OURS_ORIGIN } = {}) {
  const name = toUpstreamName(input)
  const slug = toSlug(input)
  return {
    name,
    slug,
    upstream: `${upstreamOrigin.replace(/\/$/, '')}/components/${name}`,
    ours: `${oursOrigin.replace(/\/$/, '')}/en/components/${slug}`,
  }
}

const DESKTOP = Object.freeze({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false })
const MOBILE = Object.freeze({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })

/** 四种截图组合：视口 × 颜色模式。 */
export const COMBOS = Object.freeze({
  'desktop-light': { ...DESKTOP, colorScheme: 'light' },
  'desktop-dark': { ...DESKTOP, colorScheme: 'dark' },
  'mobile-light': { ...MOBILE, colorScheme: 'light' },
  'mobile-dark': { ...MOBILE, colorScheme: 'dark' },
})

/** `desktop-dark,mobile-light` → 组合名数组，保持传入顺序并去重，未知名字抛错。 */
export function parseCombos(value) {
  if (!value)
    return Object.keys(COMBOS)
  const names = [...new Set(value.split(',').map(s => s.trim()).filter(Boolean))]
  const unknown = names.filter(n => !COMBOS[n])
  if (unknown.length > 0 || names.length === 0)
    throw new Error(`未知的组合：${unknown.join(', ') || '(空)'}，可选：${Object.keys(COMBOS).join(', ')}`)
  return names
}

/** 某个组件、某个组合的全部输出文件路径。 */
export function outputPaths(outDir, name, combo) {
  const componentDir = join(outDir, name)
  const comboDir = combo ? join(componentDir, combo) : undefined
  return {
    componentDir,
    comboDir,
    upstream: comboDir && join(comboDir, 'upstream.png'),
    ours: comboDir && join(comboDir, 'ours.png'),
    sideBySide: comboDir && join(comboDir, 'side-by-side.png'),
    diff: comboDir && join(comboDir, 'diff.png'),
    reportJson: join(componentDir, 'report.json'),
    reportMd: join(componentDir, 'report.md'),
  }
}

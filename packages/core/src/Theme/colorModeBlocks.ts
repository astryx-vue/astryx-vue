/**
 * 组件样式里的 `@light` / `@dark` 块：只在元素的颜色模式是那一种时生效。
 *
 * 元素的颜色模式按这个顺序决定：
 * 1. 最近一层 MediaTheme 表面（`data-astryx-media`）；
 * 2. 没有表面时看主题根：强制了 light 或 dark 就是它；
 * 3. 根是 system、外面也没有 Theme 强制模式时，跟随页面根画的配色：根 Theme 把它写在
 *    `<html data-astryx-scheme>` 上（页面根的 `color-scheme` 只写一种，或 `<meta name="color-scheme">`）；
 *    没写时（页面跟随读者，或服务端首屏根 Theme 还没挂载）跟随读者的偏好（`prefers-color-scheme`）；
 * 4. 根是 system、外面有 Theme 强制了模式时，跟随读者的偏好。
 *
 * 条件都写在 `:where()` 里，不加特异性，所以块和它细化的那条规则一样重，
 * 在自己的模式里按书写顺序赢过样式键本身的值，在另一个模式里什么也不写。
 */

import type { MediaSurface } from './componentStyles.js'
import { ROOT_SCHEME_UNNAMED, rootSchemeIs } from './rootSchemeAttr.js'

/** 主题根的强制模式属性（`<Theme mode="light|dark">` 写的）。 */
const MODE_ATTR = 'data-astryx-color-mode'

/** 表面嵌表面时，最近一层表面能分辨的深度（深浅交替）。更深的块不写任何规则。 */
const NEAREST_SURFACE_DEPTH = 5

export type ColorMode = 'dark' | 'light'

/** 先深后浅，同一属性两边都写时浅色赢，和 onDark / onLight 表面一致。 */
export const COLOR_MODES: readonly ColorMode[] = ['dark', 'light']

export function isColorModeKey(key: string): key is `@${ColorMode}` {
  return key === '@light' || key === '@dark'
}

function surfaceSelector(mode: MediaSurface): string {
  return `[data-astryx-media="${mode}"]`
}

/**
 * 这些祖先条件成立时，元素最近的表面是 `mode`。
 *
 * CSS 没有“最近的带某属性的祖先”这种选择器，所以逐层写：元素外面从外到里的
 * 表面形成 R 段同色的段，最近那段决定。条件 k 是 k 个深浅交替、以 `mode`
 * 结尾的表面链，且外面没有再长一层、以另一种模式结尾的链。
 */
function nearestSurfaceIs(mode: MediaSurface): string[] {
  const other: MediaSurface = mode === 'dark' ? 'light' : 'dark'
  const chain = (length: number, last: MediaSurface): string =>
    Array.from({ length }, (_, i) =>
      surfaceSelector((length - 1 - i) % 2 === 0 ? last : last === mode ? other : mode)).join(' ')
  return Array.from(
    { length: NEAREST_SURFACE_DEPTH - 1 },
    (_, i) => `:scope ${chain(i + 1, mode)} *:not(:scope ${chain(i + 2, other)} *)`,
  )
}

/** 一个模式块在主题根外面某种情形下的条件。 */
export interface ModeCondition {
  /** 接在样式键选择器（已包在 `:is()` 里）后面的 `:where()` 条件。 */
  suffix: string
  /** 规则外面要不要再包一层媒体查询（不带 `@media`）。 */
  media?: string
}

/** 模式 `mode` 的块要写的几组条件：强制模式、system 根跟随偏好、最近的表面。 */
export function modeConditions(mode: ColorMode): ModeCondition[] {
  const outsideSurfaces = ':where(:not(:scope [data-astryx-media] *))'
  const forced = `:where(:scope[${MODE_ATTR}="${mode}"] *)${outsideSurfaces}`
  const system = `:scope:not([${MODE_ATTR}="light"], [${MODE_ATTR}="dark"])`
  const forcedAround = `:is([${MODE_ATTR}="light"], [${MODE_ATTR}="dark"])`
  const unforcedSystem = `:where(${system}:not(${forcedAround} *) *)${outsideSurfaces}`
  const preference = `(prefers-color-scheme: ${mode})`
  return [
    { suffix: forced },
    { suffix: `${unforcedSystem}:where(${rootSchemeIs(mode)} *)` },
    { suffix: `${unforcedSystem}:where(${ROOT_SCHEME_UNNAMED} *)`, media: preference },
    { suffix: `:where(${forcedAround} ${system} *)${outsideSurfaces}`, media: preference },
    { suffix: `:where(${nearestSurfaceIs(mode).join(', ')})` },
  ]
}

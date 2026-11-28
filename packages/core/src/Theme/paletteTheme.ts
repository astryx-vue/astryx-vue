import type { ThemePalette } from '../palette/types'
import type { ComponentStyleMap, ThemeTokens } from './types.js'
import { mergeComponentMaps } from './mergeComponents.js'

/**
 * 主题的调色板（有的话）。不是 `themePalette()` 做出来的对象会被拒绝：
 * 一包种子色只是调色板的输入，`defineTheme` 自己不跑生成器，
 * 所以不用调色板的应用不会带上它。
 */
export function readPalette(name: string, palette: unknown): ThemePalette | undefined {
  if (palette === undefined)
    return undefined
  if (
    palette !== null
    && typeof palette === 'object'
    && (palette as { kind?: unknown }).kind === 'theme-palette'
    && typeof (palette as { tokens?: unknown }).tokens === 'object'
  ) {
    return palette as ThemePalette
  }
  const got = palette === null ? 'null' : typeof palette === 'object' ? 'a plain object' : typeof palette
  throw new Error(
    `defineTheme("${name}"): \`palette\` must be made by themePalette() from @astryx-vue/core/palette, got ${got}. `
    + `Wrap the seeds: palette: themePalette({ accent: '#5b3cc4' }).`,
  )
}

/** 调色板的颜色令牌，写在主题自己的 `tokens` 底下。 */
export function paletteTokens(palette: ThemePalette | undefined): ThemeTokens {
  return palette ? { ...palette.tokens } as ThemeTokens : {}
}

/**
 * 调色板的部位样式放在主题自己的底下：主题写了的属性逐个属性优先。
 * 调色板把两种模式各写在各自的色彩模式块里，所以主题给两种模式都写了的属性，
 * 要先从那两个块里拿掉。
 */
export function withPaletteComponents(
  palette: ThemePalette | undefined,
  own: ComponentStyleMap | undefined,
): ComponentStyleMap | undefined {
  if (!palette)
    return own
  const lifted: ComponentStyleMap = {}
  for (const [part, blocks] of Object.entries(palette.components)) {
    const styles: NonNullable<ComponentStyleMap[string]> = {}
    for (const [key, lift] of Object.entries(blocks)) {
      const ownStyle = own?.[part]?.[key]
      const set = (property: string): boolean => ownStyle != null && ownStyle[property] !== undefined
      const style: Record<string, Record<string, string>> = {}
      for (const mode of ['@light', '@dark'] as const) {
        const values = Object.entries(lift[mode]).filter(([property]) => !set(property))
        if (values.length)
          style[mode] = Object.fromEntries(values)
      }
      styles[key] = style
    }
    lifted[part] = styles
  }
  return mergeComponentMaps(lifted, own)
}

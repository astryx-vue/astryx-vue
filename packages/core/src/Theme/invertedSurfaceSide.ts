/**
 * 实心表面（比如提示卡片）在量到真实底色之前，内容该取哪一边：
 * 按测量用的同一条规则，在表面底色上比较主题的 `on-dark` 和 `on-light`，
 * 谁的对比度高就取谁。底色半透明、读不出来，或两个内容色读不出来时给 null，
 * 由调用方按颜色模式兜底。
 */

import type { RgbColor } from './contrast.js'
import { parseColor, pickMediaMode } from './contrast.js'

const ON_DARK_DEFAULT = '#ffffff'
const ON_LIGHT_DEFAULT = '#111111'

/**
 * `fill` 是表面的底色（CSS 文本）。`tokens` 是按当前颜色模式解析好的主题令牌，
 * 里面的 `--astryx-color-on-dark` 和 `--astryx-color-on-light` 没写时用标准值。
 */
export function surfaceSideOf(
  tokens: Readonly<Record<string, string>>,
  fill: string | undefined,
): 'dark' | 'light' | null {
  const background: RgbColor | null = fill === undefined ? null : parseColor(fill)
  if (background === null || background.a < 1)
    return null
  const side = pickMediaMode(
    background,
    null,
    parseColor(tokens['--astryx-color-on-dark'] ?? ON_DARK_DEFAULT),
    parseColor(tokens['--astryx-color-on-light'] ?? ON_LIGHT_DEFAULT),
  )
  return side === 'dark' || side === 'light' ? side : null
}

/**
 * 字号、间距、控件高度、圆角和时长的阶梯：把主题里的一个基准数展开成一整组 CSS 变量，
 * 并给编辑器生成对应的说明文字。
 */
import type { PlaygroundLocale } from './protocol'
import type { ThemeState } from './themeTypes'
import { TYPE_SCALES } from './themeOptions'

/**
 * Neutral motion scale from packages/themes/neutral/base.css:
 * fast 125, medium 300, slow 700, adjacent ratio 0.75, rounded to 5ms.
 */
const MOTION_BASE = [
  ['fast', 125],
  ['medium', 300],
  ['slow', 700],
] as const

const MOTION_RATIO = 0.75

const TYPE_STEPS = [
  ['4xs', -5],
  ['3xs', -4],
  ['2xs', -3],
  ['xs', -2],
  ['sm', -1],
  ['base', 0],
  ['lg', 1],
  ['xl', 2],
  ['2xl', 3],
  ['3xl', 4],
  ['4xl', 5],
  ['5xl', 6],
] as const

const SPACING_STEPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

/** px 换成 rem，按 16px 根字号。间距写成 rem，读者调大根字号时会跟着放大。 */
function pxToRem(px: number): string {
  return `${Math.round((px / 16) * 10000) / 10000}rem`
}

interface RadiusScale {
  inner: number
  element: number
  container: number
  page: number
}

interface ElementSizes {
  sm: number
  md: number
  lg: number
}

export function typeScaleRatio(id: string): number {
  return TYPE_SCALES.find(item => item.id === id)?.ratio ?? 1.2
}

/** 字号、间距、控件高度、圆角、时长这几组 CSS 变量。 */
export function scaleVariables(theme: ThemeState): Record<string, string> {
  const variables: Record<string, string> = {}

  const ratio = typeScaleRatio(theme.typeScale)
  for (const [name, step] of TYPE_STEPS) {
    variables[`--astryx-font-size-${name}`] = `${geometricPx(theme.typeSize, ratio, step)}px`
  }

  for (const step of SPACING_STEPS) {
    const name = String(step).replace('.', '-')
    variables[`--astryx-spacing-${name}`] = pxToRem(theme.spacing * step)
  }

  const element = elementSizes(theme)
  variables['--astryx-size-element-sm'] = `${element.sm}px`
  variables['--astryx-size-element-md'] = `${element.md}px`
  variables['--astryx-size-element-lg'] = `${element.lg}px`

  const radius = radiusScale(theme)
  variables['--astryx-radius-none'] = '0'
  variables['--astryx-radius-inner'] = `${radius.inner}px`
  variables['--astryx-radius-element'] = `${radius.element}px`
  variables['--astryx-radius-container'] = `${radius.container}px`
  variables['--astryx-radius-page'] = `${radius.page}px`
  variables['--astryx-radius-chat'] = `${radius.page}px`

  const multiplier = clamp(theme.duration, 0.5, 2)
  for (const [name, base] of MOTION_BASE) {
    const value = base * multiplier
    variables[`--astryx-duration-${name}`] = `${roundToFive(value)}ms`
    variables[`--astryx-duration-${name}-min`] = `${roundToFive(value * MOTION_RATIO)}ms`
    variables[`--astryx-duration-${name}-max`] = `${roundToFive(value / MOTION_RATIO)}ms`
  }

  return variables
}

export function describeType(theme: ThemeState, locale: PlaygroundLocale): string {
  const ratio = typeScaleRatio(theme.typeScale).toFixed(3)
  return locale === 'zh'
    ? `基准 ${clamp(theme.typeSize, 12, 22)}px，比例 ${ratio}`
    : `base ${clamp(theme.typeSize, 12, 22)}px, ratio ${ratio}`
}

export function describeRadius(theme: ThemeState, locale: PlaygroundLocale): string {
  const { inner, element, container, page } = radiusScale(theme)
  return locale === 'zh'
    ? `内 ${inner}px，控件 ${element}px，容器 ${container}px，页面 ${page}px`
    : `inner ${inner}px, element ${element}px, container ${container}px, page ${page}px`
}

export function describeSpacing(theme: ThemeState, locale: PlaygroundLocale): string {
  const unit = clamp(theme.spacing, 2, 8)
  return locale === 'zh' ? `1 步 = ${unit}px` : `step 1 = ${unit}px`
}

export function describeElementSize(theme: ThemeState): string {
  const { sm, md, lg } = elementSizes(theme)
  return `sm ${sm}px, md ${md}px, lg ${lg}px`
}

export function describeDuration(theme: ThemeState): string {
  const multiplier = clamp(theme.duration, 0.5, 2)
  const medium = roundToFive(300 * multiplier)
  const label = Number.isInteger(multiplier) ? String(multiplier) : multiplier.toFixed(1)
  return `${label}× (medium = ${medium}ms)`
}

/** 把数字限制在范围里。不是有限数时返回下限。 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value))
    return min
  return Math.min(max, Math.max(min, value))
}

/** 以控件圆角为基准，按 0.6、1.2、2.8 倍展开内、容器、页面三档。 */
function radiusScale(theme: ThemeState): RadiusScale {
  const element = clamp(theme.radius, 0, 28)
  return {
    inner: Math.max(0, Math.round(element * 6 / 10)),
    element,
    container: Math.round(element * 12 / 10),
    page: Math.round(element * 28 / 10),
  }
}

/** 中号控件高度为基准，小号矮 4px（不低于 20px），大号高 4px。 */
function elementSizes(theme: ThemeState): ElementSizes {
  const md = clamp(theme.elementSize, 24, 48)
  return { sm: Math.max(20, md - 4), md, lg: md + 4 }
}

function geometricPx(base: number, ratio: number, step: number): number {
  return Math.max(1, Math.round(base * ratio ** step))
}

function roundToFive(value: number): number {
  return Math.round(value / 5) * 5
}

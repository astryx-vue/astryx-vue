import type { PaletteBase, PaletteColorReader, PaletteDial, PaletteMappingContext } from './mappingTables'
import type { PaletteLift, ThemePalette, ThemePaletteInput } from './types'
import { parseColor as parseCssColor } from '../Theme/contrast.js'
import { colorDefaults, resolveDefaultColors } from './colorDefaults'
import { generateTonalPalette, PALETTE_RECIPE, PALETTE_RECIPES } from './generator'
import { mapPalette } from './mapping'
import { planPaletteRequest } from './mappingPlan'
import { LIFT_PARTS, PALETTE_DIALS } from './mappingTables'
import { hex } from './mappingTools'

const INPUT_KEYS: ReadonlyArray<string> = Object.freeze([
  ...PALETTE_DIALS,
  'vibrancy',
  'recipe',
])

/** 提亮后的次要文字写到哪里：主题目标、样式键和承载它的属性。 */
interface LiftSpot { target: string, key: string, property: string }

/**
 * 官方 Neutral 主题提亮次要文字的那些部位，按「上游部位/块」对到本库的主题目标。
 * 引用和分段控件标签的前景色在主题根上就已经代入，所以写它们自己的前景变量；
 * 树列表内容没有对应的主题目标，不在这里。
 */
const LIFT_SPOTS: Readonly<Record<string, LiftSpot | undefined>> = {
  'item/selected': { target: 'item', key: 'selected:true', property: '--color-text-secondary' },
  'file-input/mode:dropzone': { target: 'file-input', key: 'mode:dropzone', property: '--color-text-secondary' },
  'citation/variant:number': { target: 'citation', key: 'variant:number', property: '--citation-foreground' },
  'segmented-control-item/base': { target: 'segmented-control-item', key: 'base', property: '--segmented-control-item-foreground' },
  ...Object.fromEntries(
    ['blue', 'cyan', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'].map(color => [
      `card/variant:${color}`,
      { target: 'card', key: `variant:${color}`, property: '--color-text-secondary' },
    ]),
  ),
}

/** 读一个固定颜色：十六进制、rgb()、rgba()、black、white 和 transparent。 */
function parseColor(value: string): { r: number, g: number, b: number, a: number } | null {
  const text = value.trim().toLowerCase()
  if (text === 'black')
    return { r: 0, g: 0, b: 0, a: 1 }
  if (text === 'white')
    return { r: 255, g: 255, b: 255, a: 1 }
  return parseCssColor(text)
}

const coreReader: PaletteColorReader = {
  rgb: (value) => {
    const read = typeof value === 'string' ? parseColor(value) : null
    return read ? [read.r, read.g, read.b] : null
  },
  alpha: (value) => {
    if (typeof value !== 'string')
      return 1
    return parseColor(value)?.a ?? 1
  },
}

/**
 * 默认颜色在每个模式下的值，调色板拿它当尺子。
 * 每次调用现读，入口不留状态，服务端和构建时跑出的结果一样。
 */
function defaultBase(): PaletteBase {
  return {
    light: resolveDefaultColors('light'),
    dark: resolveDefaultColors('dark'),
    components: {},
  }
}

/**
 * 用几个种子色生成主题的颜色。调色板按固定的配方生成，再映射到颜色令牌
 * （和命令行的主题编辑器映射的方式一样），以默认颜色为底。把结果交给
 * `defineTheme({ palette })`，主题自己写的 `tokens` 仍然逐个令牌优先。
 *
 * @example
 * ```ts
 * import { themePalette } from '@astryx-vue/core/palette'
 * import { defineTheme } from '@astryx-vue/core/Theme'
 *
 * export const acme = defineTheme({
 *   name: 'acme',
 *   palette: themePalette({ accent: '#5b3cc4', neutral: '#6b6b70' }),
 * })
 * ```
 */
export function themePalette(input: ThemePaletteInput): ThemePalette {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new TypeError('themePalette() takes an object of seed colors, such as {accent: "#5b3cc4"}.')
  const unknown = Object.keys(input).filter(key => !INPUT_KEYS.includes(key))
  if (unknown.length) {
    throw new TypeError(
      `themePalette(): ${unknown.map(key => `"${key}"`).join(', ')} is not a palette key. It takes ${INPUT_KEYS.join(', ')}.`,
    )
  }
  const recipe = input.recipe ?? PALETTE_RECIPE
  if (!PALETTE_RECIPES.includes(recipe)) {
    throw new TypeError(
      `themePalette(): recipe "${String(input.recipe)}" is not a palette recipe. It takes ${PALETTE_RECIPES.join(', ')}.`,
    )
  }
  const { vibrancy } = input
  if (
    vibrancy !== undefined
    && (typeof vibrancy !== 'number' || !Number.isInteger(vibrancy) || vibrancy < 0 || vibrancy > 100)
  ) {
    throw new TypeError(`themePalette(): vibrancy is a whole number from 0 to 100, got ${JSON.stringify(vibrancy)}.`)
  }
  const dials: PaletteDial[] = []
  for (const id of PALETTE_DIALS) {
    const value = input[id as keyof ThemePaletteInput]
    if (value === undefined)
      continue
    const read = typeof value === 'string' ? parseColor(value) : null
    if (!read || read.a < 1) {
      throw new TypeError(
        `themePalette(): ${id} is ${JSON.stringify(value)}, and a seed is one opaque color: a hex such as "#5b3cc4", rgb(), black or white.`,
      )
    }
    dials.push({ id, seed: hex([read.r, read.g, read.b]) })
  }
  if (!dials.length)
    throw new TypeError(`themePalette() needs at least one seed color: ${PALETTE_DIALS.join(', ')}.`)

  const context: PaletteMappingContext = {
    base: defaultBase(),
    has: token => Object.hasOwn(colorDefaults, token),
    reader: coreReader,
  }
  const plan = planPaletteRequest(dials, { recipe, vibrancy }, context)
  if (!plan)
    throw new TypeError('themePalette() needs at least one seed color.')
  const candidate = generateTonalPalette(plan.config as never)
  const mapping = mapPalette(candidate, dials, plan.fills, context)

  const tokens: Record<string, readonly [string, string]> = {}
  for (const [token, { light, dark }] of Object.entries(mapping.tokens))
    tokens[token] = Object.freeze([light.color, dark.color] as const)

  const components: Record<string, Record<string, PaletteLift>> = {}
  for (const [upstreamPart, upstreamBlock, ground] of LIFT_PARTS) {
    const lifted = mapping.lift?.[ground]
    const spot = LIFT_SPOTS[`${upstreamPart}/${upstreamBlock}`]
    if (!spot || !lifted?.light || !lifted.dark)
      continue
    const blocks = components[spot.target] ?? {}
    components[spot.target] = blocks
    blocks[spot.key] = Object.freeze({
      '@light': Object.freeze({ [spot.property]: lifted.light.color }),
      '@dark': Object.freeze({ [spot.property]: lifted.dark.color }),
    })
  }
  return Object.freeze({
    kind: 'theme-palette',
    recipe,
    tokens: Object.freeze(tokens),
    components: Object.freeze(
      Object.fromEntries(Object.entries(components).map(([part, blocks]) => [part, Object.freeze(blocks)])),
    ),
  })
}

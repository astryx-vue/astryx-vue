export interface CustomProperty {
  name: string
  value: string
}

export type TokenSectionId
  = | 'color'
    | 'spacing'
    | 'size'
    | 'border'
    | 'focus'
    | 'radius'
    | 'shadow'
    | 'duration'
    | 'ease'
    | 'font'
    | 'type'

export const TOKEN_SECTION_ORDER: readonly TokenSectionId[] = [
  'color',
  'spacing',
  'size',
  'border',
  'focus',
  'radius',
  'shadow',
  'duration',
  'ease',
  'font',
  'type',
]

const hues = ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'] as const

export type ColorBucket = 'core' | 'text' | 'icon' | 'status' | 'line' | 'data' | (typeof hues)[number]

/**
 * A font size as the theme file writes it follows the reader's text size:
 * `--astryx-font-size-base: var(--_scaled-font-size-base)`, with the scaled
 * size beside it (`calc(0.875rem * var(--_dynamic-type-body, 1))`, possibly
 * capped by the next step). Token tables and the theme editor want the theme's
 * own length, so this peels the scale off.
 */
const SCALE_WRAPPER = /^calc\(\s*(-?[\d.]+(?:rem|px))\s*\*\s*var\(--_dynamic-type-[\w-]+,\s*1\)\s*\)$/
const CAPPED_SCALE_WRAPPER = /^min\(\s*(calc\(.*?\)),\s*var\(--_scaled-[\w-]+\)\s*\)$/

function ownSize(value: string): string {
  const inner = CAPPED_SCALE_WRAPPER.exec(value)?.[1] ?? value
  return SCALE_WRAPPER.exec(inner)?.[1] ?? value
}

export function parseCustomProperties(css: string): CustomProperty[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const properties: CustomProperty[] = []
  const scaled = new Map<string, string>()

  for (const line of withoutComments.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('--astryx-') && !trimmed.startsWith('--_scaled-'))
      continue

    const colon = trimmed.indexOf(':')
    const semicolon = trimmed.lastIndexOf(';')
    if (colon <= 0 || semicolon <= colon)
      continue

    const name = trimmed.slice(0, colon).trim()
    const value = trimmed.slice(colon + 1, semicolon).trim()
    if (name.startsWith('--_scaled-'))
      scaled.set(name, ownSize(value))
    else
      properties.push({ name, value })
  }

  return properties.map((property) => {
    const own = /^var\((--_scaled-[\w-]+)\)$/.exec(property.value)?.[1]
    if (own !== undefined)
      return { name: property.name, value: scaled.get(own) ?? property.value }
    return { name: property.name, value: ownSize(property.value) }
  })
}

export function sectionId(name: string): TokenSectionId | null {
  if (name.startsWith('--astryx-color-'))
    return 'color'
  if (name.startsWith('--astryx-spacing-'))
    return 'spacing'
  if (name.startsWith('--astryx-size-'))
    return 'size'
  if (name === '--astryx-border-width')
    return 'border'
  if (name.startsWith('--astryx-focus-'))
    return 'focus'
  if (name.startsWith('--astryx-radius-'))
    return 'radius'
  if (name.startsWith('--astryx-shadow-'))
    return 'shadow'
  if (name.startsWith('--astryx-duration-'))
    return 'duration'
  if (name.startsWith('--astryx-ease-'))
    return 'ease'
  if (name.startsWith('--astryx-font-'))
    return 'font'
  if (name.startsWith('--astryx-text-'))
    return 'type'
  return null
}

export function colorBucket(name: string): ColorBucket {
  if (name.startsWith('--astryx-color-data-'))
    return 'data'
  const hue = hues.find(item => name.endsWith(`-${item}`))
  if (hue)
    return hue
  if (name.includes('inverted'))
    return 'core'
  if (name.includes('success') || name.includes('error') || name.includes('warning') || name.includes('info'))
    return 'status'
  if (
    name.includes('border')
    || name.includes('skeleton')
    || name.includes('track')
    || name.includes('shadow')
    || name.includes('tint')
  ) {
    return 'line'
  }
  if (name.includes('-text-') || name.includes('-on-'))
    return 'text'
  if (name.includes('-icon-'))
    return 'icon'
  return 'core'
}

function splitTopLevel(input: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''

  for (const char of input) {
    if (char === '(')
      depth += 1
    else if (char === ')')
      depth -= 1

    if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim())
    parts.push(current.trim())

  return parts
}

export function splitLightDark(value: string): { light: string, dark: string } | null {
  const trimmed = value.trim()
  if (!trimmed.startsWith('light-dark(') || !trimmed.endsWith(')'))
    return null

  const parts = splitTopLevel(trimmed.slice('light-dark('.length, -1))
  const light = parts[0]
  const dark = parts[1]
  if (parts.length !== 2 || !light || !dark)
    return null

  return { light, dark }
}

export function resolveStop(
  expr: string,
  byName: Map<string, string>,
  scheme: 'light' | 'dark',
  seen = new Set<string>(),
): string {
  const reference = expr.match(/^var\((--astryx-[a-z0-9-]+)\)$/)
  const name = reference?.[1]
  if (!name)
    return expr
  if (seen.has(name))
    return 'transparent'

  seen.add(name)
  const target = byName.get(name)
  if (!target)
    return 'transparent'

  const stops = splitLightDark(target)
  if (!stops)
    return resolveStop(target, byName, scheme, seen)

  return resolveStop(stops[scheme], byName, scheme, seen)
}

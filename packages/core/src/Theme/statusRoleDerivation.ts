/**
 * Status roles a custom theme leaves unset, computed from its own colors.
 *
 * Each status (`info`, `success`, `warning`, `error`) has one strong fill,
 * `--color-<status>`, and a pale fill, `--color-<status>-muted`. When a theme
 * sets a fill, a pale fill, a surface, or its light or dark content color, the
 * roles measured against those colors are worked out for it:
 * - `--color-on-<status>`: `--color-on-dark` or `--color-on-light`, whichever
 *   contrasts more with the fill, or pure white or black when neither reaches
 *   4.5:1;
 * - `--color-text-<status>`: the fill's hue at 4.5:1 on surface and card;
 * - `--color-on-<status>-muted`: the fill's hue at 4.5:1 on the pale fill over
 *   the surface.
 * `--color-icon-<status>` and `--color-border-<status>` then follow the text
 * role. Fills are never derived, and a role the theme sets is never replaced.
 * A color the theme leaves unset is read from `STATUS_COLOR_DEFAULTS`.
 */
import type { RgbColor } from './contrast.js'
import { compositeOver, contrastRatio, parseColor } from './contrast.js'
import { isChromatic, opaqueOver, solveLightness, toHex } from './statusColor.js'
import { STATUS_COLOR_DEFAULTS } from './statusColorDefaults.js'
import { normalizeTokenName } from './tokenName.js'

export const STATUS_NAMES = ['info', 'success', 'warning', 'error'] as const
export type StatusName = (typeof STATUS_NAMES)[number]

type Mode = 'light' | 'dark'

const TEXT_RATIO = 4.5
// Solve a little above the floor so rounding to #RRGGBB never lands below it.
const SOLVE_RATIO = TEXT_RATIO + 0.08
const WHITE: RgbColor = { r: 255, g: 255, b: 255, a: 1 }
const BLACK: RgbColor = { r: 0, g: 0, b: 0, a: 1 }

const DEFAULTS: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(STATUS_COLOR_DEFAULTS).map(([name, value]) => [normalizeTokenName(name), value]),
)

const name = (bare: string): string => normalizeTokenName(bare)
const SURFACE = name('--color-background-surface')
const CARD = name('--color-background-card')
const ON_DARK = name('--color-on-dark')
const ON_LIGHT = name('--color-on-light')
const fillOf = (status: StatusName): string => name(`--color-${status}`)
const mutedOf = (status: StatusName): string => name(`--color-${status}-muted`)

const ROLE_TOKENS = {
  on: (s: StatusName) => name(`--color-on-${s}`),
  text: (s: StatusName) => name(`--color-text-${s}`),
  onMuted: (s: StatusName) => name(`--color-on-${s}-muted`),
} as const
type Role = keyof typeof ROLE_TOKENS
const ROLES = Object.keys(ROLE_TOKENS) as Role[]

/** Roles that follow the text role. */
const TEXT_FOLLOWERS = [
  (s: StatusName) => name(`--color-icon-${s}`),
  (s: StatusName) => name(`--color-border-${s}`),
] as const

/** Split on commas outside parentheses. */
function splitTopLevel(input: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of input) {
    if (ch === '(')
      depth++
    if (ch === ')')
      depth--
    if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  parts.push(current.trim())
  return parts
}

const VAR_REF = /^var\(\s*(--[\w-]+)\s*(?:,(.*))?\)$/s

/**
 * One token's concrete value in a mode, following `light-dark()` and `var()`
 * through the theme's tokens and then the defaults.
 */
function resolveToken(tokens: Readonly<Record<string, string>>, token: string, mode: Mode, seen: ReadonlySet<string>): string | undefined {
  if (seen.has(token))
    return undefined
  const raw = tokens[token] ?? DEFAULTS[token]
  return raw === undefined ? undefined : resolveValue(tokens, raw, mode, new Set([...seen, token]))
}

function resolveValue(tokens: Readonly<Record<string, string>>, raw: string, mode: Mode, seen: ReadonlySet<string>): string | undefined {
  const value = raw.trim()
  if (/^light-dark\(/i.test(value) && value.endsWith(')')) {
    const [light = '', dark = ''] = splitTopLevel(value.slice(value.indexOf('(') + 1, -1))
    return resolveValue(tokens, mode === 'light' ? light : dark, mode, seen)
  }
  const ref = VAR_REF.exec(value)
  if (ref?.[1]) {
    const resolved = resolveToken(tokens, ref[1], mode, seen)
    return resolved ?? (ref[2] ? resolveValue(tokens, ref[2], mode, seen) : undefined)
  }
  return value
}

function colorAt(tokens: Readonly<Record<string, string>>, token: string, mode: Mode): RgbColor | null {
  const value = resolveToken(tokens, token, mode, new Set())
  return value === undefined ? null : parseColor(value)
}

/** The fill's hue, or the default fill's when the theme's fill is grey. */
function statusHue(tokens: Readonly<Record<string, string>>, status: StatusName, mode: Mode): RgbColor | null {
  const color = colorAt(tokens, fillOf(status), mode)
  if (color !== null && isChromatic(color))
    return { ...color, a: 1 }
  const fallback = colorAt({}, fillOf(status), mode)
  return fallback === null ? null : { ...fallback, a: 1 }
}

type ModeRoles = Partial<Record<Role, RgbColor>>

function deriveForMode(tokens: Readonly<Record<string, string>>, status: StatusName, mode: Mode): ModeRoles | null {
  // Every measured color must be concrete. An oklch() value or an unknown
  // reference leaves the status alone rather than guessing.
  const source = colorAt(tokens, fillOf(status), mode)
  const hue = statusHue(tokens, status, mode)
  const surface = colorAt(tokens, SURFACE, mode)
  const cardColor = colorAt(tokens, CARD, mode)
  const muted = colorAt(tokens, mutedOf(status), mode)
  const onDark = colorAt(tokens, ON_DARK, mode)
  const onLight = colorAt(tokens, ON_LIGHT, mode)
  if (!source || !hue || !surface || !cardColor || !muted || !onDark || !onLight)
    return null

  const opaqueSurface = opaqueOver(surface)
  const card = opaqueOver(cardColor, opaqueSurface)
  const fill = opaqueOver(source, opaqueSurface)
  const roles: ModeRoles = {}

  const lightInk = opaqueOver(onDark, fill)
  const darkInk = opaqueOver(onLight, fill)
  const themeInk = contrastRatio(lightInk, fill) >= contrastRatio(darkInk, fill) ? lightInk : darkInk
  // A theme's off-white and off-black can both miss the floor on a mid-tone
  // fill; pure white or black always reaches it.
  roles.on = contrastRatio(themeInk, fill) >= TEXT_RATIO
    ? themeInk
    : contrastRatio(WHITE, fill) >= contrastRatio(BLACK, fill) ? WHITE : BLACK

  const text = solveLightness(hue, [opaqueSurface, card], SOLVE_RATIO)
  if (text)
    roles.text = text

  const pale = compositeOver(muted, opaqueSurface)
  const onMuted = solveLightness(hue, [pale], SOLVE_RATIO)
  if (onMuted)
    roles.onMuted = onMuted
  return roles
}

/**
 * `light-dark()` values for every status role a theme leaves unset while
 * setting a color that role is measured against, plus icon and border roles
 * that follow a text role the theme sets or gets here.
 *
 * `tokens` are the theme's own `--astryx-` prefixed values.
 */
export function deriveStatusRoleTokens(tokens: Readonly<Record<string, string>>): Record<string, string> {
  const authored = (token: string): boolean => tokens[token] !== undefined
  const surfaceSet = authored(SURFACE) || authored(CARD)
  const inkSet = authored(ON_DARK) || authored(ON_LIGHT)
  const derived: Record<string, string> = {}
  for (const status of STATUS_NAMES) {
    const fillSet = authored(fillOf(status))
    const affects: Record<Role, boolean> = {
      on: fillSet || inkSet,
      text: fillSet || surfaceSet,
      onMuted: fillSet || authored(mutedOf(status)) || surfaceSet,
    }
    const light = deriveForMode(tokens, status, 'light')
    const dark = deriveForMode(tokens, status, 'dark')
    if (light && dark) {
      for (const role of ROLES) {
        const token = ROLE_TOKENS[role](status)
        const pair = [light[role], dark[role]] as const
        if (!affects[role] || authored(token) || !pair[0] || !pair[1])
          continue
        derived[token] = `light-dark(${toHex(pair[0])}, ${toHex(pair[1])})`
      }
    }
    const textRole = ROLE_TOKENS.text(status)
    if (!authored(textRole) && derived[textRole] === undefined)
      continue
    for (const follower of TEXT_FOLLOWERS) {
      const token = follower(status)
      // An authored text role that reads the follower would close a cycle.
      if (!authored(token) && !tokens[textRole]?.includes(token))
        derived[token] = `var(${textRole})`
    }
  }
  return derived
}

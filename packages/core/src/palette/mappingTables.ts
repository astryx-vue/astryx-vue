import type { TonalPaletteCandidate, TonalPaletteGenerationInput } from './types'

export type PaletteMode = 'light' | 'dark'
export type ColorTriple = [number, number, number]

/** One token pointed at a palette stop in one mode. */
export interface StopRef {
  stop: number
  /** The stop's color, with `alpha` appended when set. */
  color: string
  /** Two hex digits of opacity. */
  alpha?: string
  /** The family the stop is from when it is not the token's own: `neutral` for text on a fill, `black` or `white` for the palette's own ends, `literal` for a color outside the palette. */
  family?: string
  /** The stop holds the seed's exact color (an exact anchor). */
  exact?: boolean
}

/** One contrast check behind a stop choice. */
export interface ContrastCheck {
  token: string
  mode: PaletteMode
  stop: number
  /** The stop the mapping starts from. */
  preferred: number
  /** What it was measured on. */
  against: string
  /** The lowest ratio over everything it was measured on. */
  ratio: number
  needs: number
  pass: boolean
  /** The whole sentence to report, when the check is not a plain stop move. */
  note?: string
  /** The color settings whose notes report it, when its token belongs to none of them. */
  dials?: string[]
  /** The nearest setting that passes it, when one does: a darker exact color for a pale fill. */
  fix?: { thing: string, value: string, mode?: PaletteMode }
}

/** How the stop of an accent or status color's exact fill was settled. */
export interface PaletteFill {
  stop: number
  dark: boolean
  why: string
  ratio: number
}

/** Reads a fixed CSS color: its RGB (0–255) and its opacity (0–1). */
export interface PaletteColorReader {
  rgb: (value: unknown) => ColorTriple | null
  alpha: (value: unknown) => number
}

/** The resolved colors the mapping measures against, per mode. */
export interface PaletteBase {
  light: Record<string, string>
  dark: Record<string, string>
  /** Part styles, which may lift secondary text on some parts. */
  components?: Record<string, unknown>
}

/** What the mapping reads around the palette. */
export interface PaletteMappingContext {
  base?: PaletteBase
  /** Whether a token exists, so the mapping sets it. */
  has: (token: string) => boolean
  reader: PaletteColorReader
  /** The value a token is set to exactly in a mode, as written. */
  settingOf?: (token: string, mode: PaletteMode) => string | undefined
  /** The fixed color a written value gives in a mode, or null. */
  colorIn?: (value: string, mode: PaletteMode) => string | null
  /** Whether a token is set exactly in any mode. */
  setExactly?: (token: string) => boolean
  /** The line that sets a value, for a note that offers one; without it, the note offers none. */
  setLine?: (thing: string, value: string, mode?: PaletteMode) => string
}

/** One color setting: a palette family of the same id. */
export interface PaletteDial {
  id: string
  seed: string
}

/** A family of a palette config: the generator's family input, and any key of the author's. */
export interface ConfigFamily {
  id?: unknown
  seed?: unknown
  anchors?: { mode: string, stop: number, [key: string]: unknown }[]
  [key: string]: unknown
}

/** A palette config: the generator's request, and any key of the author's. */
export interface PaletteConfig {
  families: ConfigFamily[]
  [key: string]: unknown
}

/**
 * A palette config as the generator's request. The generator checks every
 * field it reads, and refuses a config it cannot run.
 */
export function asRequest(config: PaletteConfig): TonalPaletteGenerationInput {
  return config as unknown as TonalPaletteGenerationInput
}

/** A family's stops in a mode. */
export function rampOf(candidate: TonalPaletteCandidate, id: string, m: PaletteMode): Record<string | number, string> {
  return candidate.palette[id]?.[m] ?? {}
}

/** One block of a part's styles, or undefined. */
export function partStyle(
  components: Record<string, unknown> | undefined,
  part: string,
  block: string,
): Record<string, unknown> | undefined {
  const blocks = components?.[part]
  const style
    = blocks && typeof blocks === 'object'
      ? (blocks as Record<string, unknown>)[block]
      : undefined
  return style && typeof style === 'object'
    ? (style as Record<string, unknown>)
    : undefined
}

/** The token mapping of a palette. */
export interface PaletteMapping {
  tokens: Record<string, { family: string, light: StopRef, dark: StopRef }>
  contrast: ContrastCheck[]
  /** Main tokens set exactly, per mode: the color's fill gives way to them. */
  exact: Record<string, Partial<Record<PaletteMode, string>>>
  /** Main tokens set exactly to a value that is not one readable color in some mode, as written. */
  unread: Record<string, string>
  /** Lifted secondary text per background token of LIFT_PARTS, per mode; null without one. */
  lift: Record<string, Partial<Record<PaletteMode, StopRef>>> | null
}

/** The color settings. Each one is a palette family of the same id. */
export const PALETTE_DIALS = Object.freeze([
  'accent',
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
])

/** The generator's vibrancy when the theme sets none. */
export const VIBRANCY_DEFAULT = 50

/** A value a mapping table holds. */
export type TableEntry = object | string | number | boolean | null | undefined

/** A record without inherited keys, so a key such as `constructor` reads nothing. */
export function ownTable<T extends object>(table: T): T {
  const own = (value: TableEntry): TableEntry => {
    if (Array.isArray(value)) {
      return value.map(own)
    }
    if (
      !value
      || typeof value !== 'object'
      || Object.getPrototypeOf(value) !== Object.prototype
    ) {
      return value
    }
    const out: Record<string, TableEntry> = Object.create(null)
    for (const [key, entry] of Object.entries(
      value as Record<string, TableEntry>,
    )) {
      out[key] = own(entry)
    }
    return out
  }
  return own(table) as T
}

/** The Core token word of each status family. */
export const STATUS_TOKEN: Record<string, string> = ownTable({
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'info',
})

/** The main token a color setting feeds: the exact-token escape hatch for it. */
export function paletteToken(dial: string): string {
  return dial === 'accent'
    ? '--color-accent'
    : dial === 'neutral'
      ? '--color-background-surface'
      : `--color-${STATUS_TOKEN[dial]}`
}

/** Text contrast and non-text contrast (fills, focus rings, icons). */
export const TEXT = 4.5
export const NON_TEXT = 3

/**
 * The official Neutral theme's color mapping: each token's stops,
 * `[light, dark]`, with an opacity where it has one. A test keeps it equal
 * to the Neutral theme's source.
 */
export const OFFICIAL_NEUTRAL_STOPS: Readonly<
  Record<string, ReadonlyArray<{ stop: number, alpha?: string }>>
> = ownTable({
  '--color-background-body': [{ stop: 95 }, { stop: 10 }],
  '--color-background-surface': [{ stop: 100 }, { stop: 15 }],
  '--color-background-card': [{ stop: 100 }, { stop: 10 }],
  '--color-background-popover': [{ stop: 100 }, { stop: 10 }],
  '--color-background-muted': [{ stop: 95 }, { stop: 10 }],
  '--color-text-primary': [{ stop: 0 }, { stop: 100 }],
  '--color-text-secondary': [{ stop: 30 }, { stop: 65 }],
  '--color-text-disabled': [{ stop: 60 }, { stop: 35 }],
  '--color-icon-primary': [{ stop: 0 }, { stop: 100 }],
  '--color-icon-secondary': [{ stop: 45 }, { stop: 65 }],
  '--color-icon-disabled': [{ stop: 60 }, { stop: 35 }],
  '--color-border-emphasized': [{ stop: 85 }, { stop: 35 }],
  '--color-skeleton': [{ stop: 85 }, { stop: 35 }],
  '--color-on-dark': [{ stop: 100 }, { stop: 100 }],
  '--color-on-light': [{ stop: 5 }, { stop: 5 }],
  '--color-border': [
    { stop: 0, alpha: '14' },
    { stop: 100, alpha: '1a' },
  ],
  '--color-overlay-hover': [
    { stop: 0, alpha: '0d' },
    { stop: 100, alpha: '0d' },
  ],
  '--color-overlay-pressed': [
    { stop: 0, alpha: '1a' },
    { stop: 100, alpha: '1a' },
  ],
  '--color-text-info': [{ stop: 45 }, { stop: 80 }],
  '--color-accent-muted': [{ stop: 85 }, { stop: 30 }],
  '--color-info-muted': [{ stop: 85 }, { stop: 75, alpha: '3d' }],
  '--color-on-info-muted': [{ stop: 25 }, { stop: 80 }],
  '--color-on-accent': [{ stop: 100 }, { stop: 5 }],
})

/** The parts whose secondary text the official Neutral theme lifts, `[part, block]`. */
export const OFFICIAL_NEUTRAL_LIFTED: ReadonlyArray<readonly [string, string]>
  = Object.freeze([
    ['item', 'selected'],
    ['tree-list-item', 'selected'],
    ['file-input', 'mode:dropzone'],
    ['citation', 'variant:number'],
    ['segmented-control-item', 'base'],
    ['card', 'variant:blue'],
    ['card', 'variant:cyan'],
    ['card', 'variant:green'],
    ['card', 'variant:orange'],
    ['card', 'variant:pink'],
    ['card', 'variant:purple'],
    ['card', 'variant:red'],
    ['card', 'variant:teal'],
    ['card', 'variant:yellow'],
  ] as const)

/** A token's official `[light, dark]` stops. */
export function officialStops(token: string): [number, number] {
  return (OFFICIAL_NEUTRAL_STOPS[token] ?? []).map(x => x.stop) as [number, number]
}

/**
 * The tokens the neutral color sets at the official theme's stops: the
 * page background and the surfaces on it. A warm or cool gray so reaches
 * the page as it reaches the cards. The inverted surface (tooltips,
 * toasts) is the card surface of the other mode, inside the ramp (never
 * the white or black end every ramp shares), so it carries the neutral
 * color. A layout without one of these stops uses the nearest one it has.
 */
export const NEUTRAL_STOPS: Record<string, [number, number]> = ownTable({
  ...Object.fromEntries(
    [
      '--color-background-body',
      '--color-background-surface',
      '--color-background-card',
      '--color-background-popover',
      '--color-background-muted',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-text-disabled',
      '--color-icon-primary',
      '--color-icon-secondary',
      '--color-icon-disabled',
      '--color-border-emphasized',
      '--color-skeleton',
      '--color-on-dark',
      '--color-on-light',
    ].map(t => [t, officialStops(t)]),
  ),
  '--color-background-inverted': [
    ...officialStops('--color-background-card'),
  ].reverse() as [number, number],
})
/** Neutral tokens whose shade stays inside the ramp, off its white and black ends. */
export const NEUTRAL_INSIDE: ReadonlyArray<string> = Object.freeze([
  '--color-background-inverted',
])
/** Neutral tints: a stop with an opacity, `[[stop, alpha], [stop, alpha]]`. */
export const NEUTRAL_TINTS: Record<
  string,
  [[number, string], [number, string]]
> = ownTable(
  Object.fromEntries(
    ['--color-border', '--color-overlay-hover', '--color-overlay-pressed'].map(
      t => [
        t,
        (OFFICIAL_NEUTRAL_STOPS[t] ?? []).map((x): [number, string] => [
          x.stop,
          String(x.alpha),
        ]) as [[number, string], [number, string]],
      ],
    ),
  ),
)
/**
 * Accent and status stops, `[light, dark]`, as the official Neutral theme
 * maps its accent tint and its status families (info stands for them). The
 * dark fill starts at 70 when the exact color does not read in dark. A
 * status tint is translucent in dark (`[stop, alpha]`).
 */
export const DARK_FILL = 70
export const TEXT_STOP = officialStops('--color-text-info')
export const ACCENT_MUTED = officialStops('--color-accent-muted')
export const STATUS_MUTED = (
  OFFICIAL_NEUTRAL_STOPS['--color-info-muted'] ?? []
).map((x, i) => (i === 0 ? x.stop : [x.stop, String(x.alpha)])) as [
  number,
  [number, string],
]
export const ON_MUTED = officialStops('--color-on-info-muted')
/**
 * The parts whose secondary text the official Neutral theme lifts, with
 * the block it lifts it in and what the text sits on: the accent tint,
 * except under segmented-control labels, which sit on the translucent
 * neutral track (`--color-neutral`).
 */
export const LIFT_PARTS: ReadonlyArray<[string, string, string]>
  = OFFICIAL_NEUTRAL_LIFTED.map(([part, block]) => [
    part,
    block,
    liftGround(part, block),
  ])
/**
 * What a lifted block's secondary text sits on: a card's own fill for a
 * card colour (the card variant rule lifts it there), the translucent
 * neutral track under segmented-control labels, else the accent tint.
 */
export function liftGround(part: string, block: string): string {
  if (part === 'segmented-control-item') {
    return '--color-neutral'
  }
  const color = part === 'card' ? /^variant:([\w-]+)$/.exec(block)?.[1] : null
  return color ? `--color-background-${color}` : '--color-accent-muted'
}
/** What each lifted background is, and the parts on it, for notes. */
export const LIFT_GROUNDS: Record<string, { what: string, parts: string }> = {
  '--color-accent-muted': {
    what: 'the accent tint',
    parts: 'selected items and rows, a dropzone, numbered citations',
  },
  '--color-neutral': {
    what: 'the neutral track',
    parts: 'segmented-control labels',
  },
  ...Object.fromEntries(
    LIFT_PARTS.filter(([part]) => part === 'card').map(([, block, g]) => {
      const color = block.replace(/^variant:/, '')
      return [g, { what: `the ${color} card fill`, parts: `${color} cards` }]
    }),
  ),
}
export const BORDER: [number, number] = [80, 65]
/**
 * Text on a fill, from the neutral family as the official themes take it:
 * white (100) first in light, near-black (5) first in dark, and near-black
 * first in both modes on warning. Without a neutral color, black and white.
 */
const [ON_LIGHT, ON_DARK] = officialStops('--color-on-accent')
export const ON_FILL: Record<PaletteMode, [number, number]> = ownTable({
  light: [ON_LIGHT, ON_DARK],
  dark: [ON_DARK, ON_LIGHT],
})
/** Text on surfaces darkens in light mode and lightens in dark mode. */
export const TOWARD_CONTRAST: Record<PaletteMode, 1 | -1> = ownTable({
  light: -1,
  dark: 1,
})

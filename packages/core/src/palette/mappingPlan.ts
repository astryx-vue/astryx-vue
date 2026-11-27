import type { ConfigFamily, PaletteConfig, PaletteDial, PaletteFill, PaletteMappingContext, PaletteMode } from './mappingTables'
import type { PaletteTools } from './mappingTools'
import { PALETTE_BLACK, PALETTE_WHITE } from './generatorBase'
import { generateTonalPalette } from './generatorRequest'
import { asRequest, NON_TEXT, TEXT } from './mappingTables'
import { isGray, paletteTools, round, sameColor, seedStop } from './mappingTools'

/**
 * Whether the exact seed color works as the dark fill: text on it reads at
 * 4.5:1 and it stands out from the dark surfaces at 3:1. Why not otherwise.
 */
export function darkExact(
  t: PaletteTools,
  id: string,
  seed: string,
): { ok: boolean, ratio: number, why: string } {
  const on = t.onFor(id, 'dark', seed)
  if (on.r < TEXT) {
    return {
      ok: false,
      ratio: round(on.r),
      why: `your exact color reads at only ${round(on.r)}:1 with any text shade, and text needs ${TEXT}:1`,
    }
  }
  const p = t.page(seed, 'dark', id)
  if (p < NON_TEXT) {
    return {
      ok: false,
      ratio: round(p),
      why: `your exact color stands out from the dark page at only ${round(p)}:1, and a fill needs ${NON_TEXT}:1`,
    }
  }
  return { ok: true, ratio: round(on.r), why: '' }
}

/** One family of a request, with its exact seed anchors. */
export interface PaletteRequestFamily {
  id: string
  name: string
  seed: string
  kind?: 'neutral'
  anchors?: {
    mode: PaletteMode
    stop: number
    color: string
    policy: 'exact'
  }[]
  [key: string]: unknown
}

/**
 * The family a color setting makes: its seed, a gray seed generated as a
 * neutral, and the seed's exact color anchored at its nearest light stop
 * (both modes for neutral). White or black as neutral holds no anchor:
 * they already end every ramp.
 */
export function dialFamily(
  dial: PaletteDial,
  config: { stops?: number[], vibrancy?: number },
  modes: ReadonlyArray<PaletteMode>,
): { family: PaletteRequestFamily, stop: number } {
  const neutral = dial.id === 'neutral'
  const kind = neutral || isGray(dial.seed) ? 'neutral' : undefined
  const stop = seedStop(dial.seed, config, kind ?? 'chromatic')
  const ends
    = neutral
      && (sameColor(dial.seed, PALETTE_WHITE)
        || sameColor(dial.seed, PALETTE_BLACK))
  const anchors = ends
    ? []
    : (neutral ? modes : modes.filter(m => m === 'light')).map(m => ({
        mode: m,
        stop,
        color: dial.seed,
        policy: 'exact' as const,
      }))
  return {
    family: {
      id: dial.id,
      name: dial.id[0].toUpperCase() + dial.id.slice(1),
      seed: dial.seed,
      ...(kind ? { kind } : {}),
      ...(anchors.length ? { anchors } : {}),
    },
    stop,
  }
}

/**
 * Anchors each accent and status seed in dark too where it reads there, as
 * the official themes anchor a brand color in both modes. Settles each
 * fill's `dark`, `why` and `ratio`; returns the families with the dark
 * anchors that the generator can hold, and the notes of any anchor of the
 * author's that one replaces.
 */
export function anchorDarkFills(
  config: PaletteConfig,
  dials: ReadonlyArray<PaletteDial>,
  fills: Record<string, PaletteFill>,
  context: PaletteMappingContext,
  replaced: (id: string, stop: number) => void = () => {},
): ConfigFamily[] {
  const t = paletteTools(generateTonalPalette(asRequest(config)), context)
  const add: string[] = []
  for (const [id, fill] of Object.entries(fills)) {
    const seed = dials.find(f => f.id === id)?.seed as string
    const check = darkExact(t, id, seed)
    Object.assign(fill, { why: check.why, ratio: check.ratio })
    if (check.ok) {
      add.push(id)
    }
  }
  const withDark = (id: string, cfg: typeof config): typeof config => ({
    ...cfg,
    families: cfg.families.map((f) => {
      if (f?.id !== id) {
        return f
      }
      const anchor = {
        mode: 'dark',
        stop: fills[id].stop,
        color: f.seed,
        policy: 'exact',
      }
      const own: { mode: string, stop: number }[] = f.anchors ?? []
      const others = own.filter(
        a => !(a.mode === 'dark' && a.stop === anchor.stop),
      )
      if (others.length < own.length) {
        replaced(id, anchor.stop)
      }
      return {
        ...f,
        anchors: [...others, anchor].sort((a, b) =>
          a.mode === b.mode ? a.stop - b.stop : a.mode === 'light' ? -1 : 1,
        ),
      }
    }),
  })
  let next = config
  for (const id of add) {
    const tried = withDark(id, next)
    try {
      generateTonalPalette(asRequest(tried))
      next = tried
      fills[id].dark = true
    }
    catch {
      fills[id].why
        = 'the dark shades cannot hold your exact color and stay in order from dark to light'
    }
  }
  return next.families
}

/** An accent or status fill at its seed's stop, before dark mode is settled. */
export function fillAt(stop: number): PaletteFill {
  return {
    stop,
    dark: false,
    why: '',
    ratio: 0,
  }
}

/** What `planPaletteRequest` settles for a set of color settings. */
export interface PalettePlan {
  config: {
    recipe?: string
    vibrancy?: number
    modeStrategy: 'light-and-dark'
    families: ConfigFamily[]
  }
  fills: Record<string, PaletteFill>
}

/**
 * The generation request for color settings with no palette config of the
 * author's: one family per setting in setting order, each seed anchored
 * exactly, in dark too where it reads there. Null without a setting.
 */
export function planPaletteRequest(
  dials: ReadonlyArray<PaletteDial>,
  options: { recipe?: string, vibrancy?: number },
  context: PaletteMappingContext,
): PalettePlan | null {
  if (!dials.length) {
    return null
  }
  const modes: PaletteMode[] = ['light', 'dark']
  const config: PalettePlan['config'] = {
    ...(options.recipe ? { recipe: options.recipe } : {}),
    ...(options.vibrancy != null ? { vibrancy: options.vibrancy } : {}),
    modeStrategy: 'light-and-dark',
    families: [],
  }
  const fills: Record<string, PaletteFill> = {}
  for (const dial of dials) {
    const { family, stop } = dialFamily(dial, config, modes)
    if (dial.id !== 'neutral') {
      fills[dial.id] = fillAt(stop)
    }
    config.families.push(family)
  }
  if (Object.keys(fills).length) {
    config.families = anchorDarkFills(config, dials, fills, context)
  }
  return { config, fills }
}

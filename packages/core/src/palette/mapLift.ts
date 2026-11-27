import type { ColorTriple, PaletteMode, StopRef } from './mappingTables'
import type { MapState } from './mapState'
import { perceptualDelta } from './generatorRamp'
import { LIFT_GROUNDS, LIFT_PARTS, partStyle, rampOf, TEXT, TOWARD_CONTRAST } from './mappingTables'
import { compositeOver, grownGrays, hex, round, sides } from './mappingTools'

export function mapLift(s: MapState) {
  const { candidate, ref, rawOf, surfaces, contrast, parseColor, alphaOf, base, modes, tokens, checks, neutral } = s
  const valueOf = (m: PaletteMode, token: string): string | null => {
    const v
      = rawOf(token, m) ?? tokens[token]?.[m].color ?? base?.[m]?.[token]
    return v && parseColor(v) ? v : null
  }
  /** The secondary text a mode starts from. */
  const startText = (m: PaletteMode): string | null => {
    const v
      = tokens['--color-text-secondary']?.[m].color
        ?? base?.[m]?.['--color-text-secondary']
    const rgb = v ? parseColor(v) : null
    return rgb ? hex(rgb) : null
  }
  /** The gray ramp of a mode, and whether its shades are the palette's neutral ones. */
  const grays = (
    m: PaletteMode,
  ): { ramp: Record<string, string>, palette: boolean } | null => {
    if (neutral) {
      return {
        ramp: rampOf(candidate, 'neutral', m),
        palette: true,
      }
    }
    const seed = startText(m)
    const ramp = seed ? grownGrays(seed, m) : null
    return ramp ? { ramp, palette: false } : null
  }
  /** A color drawn over each of `under`, as the eye sees it. */
  const drawn = (
    name: string,
    color: string,
    under: [string, string][],
  ): [string, string][] => {
    const top = parseColor(color) as ColorTriple
    const a = alphaOf(color)
    return under.map(([n, c]) => [
      `${name} over ${n}`,
      hex(compositeOver(top, a, parseColor(c) as ColorTriple)),
    ])
  }
  const found: Record<string, Partial<Record<PaletteMode, StopRef>>> = {}
  for (const ground of new Set(LIFT_PARTS.map(([, , g]) => g))) {
    const { what, parts } = LIFT_GROUNDS[ground]
    /**
     * The shade the base theme itself lifts this ground's text to in a
     * mode, when it gives one: the search starts there, so a change of
     * color moves it only when that shade no longer reads.
     */
    const baseLift = (m: PaletteMode): string | null => {
      for (const [part, block, g] of LIFT_PARTS) {
        if (g !== ground) {
          continue
        }
        const v = partStyle(base?.components, part, block)?.[
          '--color-text-secondary'
        ]
        const pair = sides(v)
        const c = pair?.[m === 'light' ? 0 : 1]?.trim()
        const rgb = c ? parseColor(c) : null
        if (rgb) {
          return hex(rgb)
        }
      }
      return null
    }
    const byMode: Partial<Record<PaletteMode, StopRef>> = {}
    for (const m of modes) {
      const own = rawOf('--color-text-secondary', m)
      const literal = (): void => {
        byMode[m] = { stop: 0, color: own as string, family: 'literal' }
      }
      const fillColor = valueOf(m, ground)
      const g = grays(m)
      const textColor = startText(m)
      if (!fillColor || !g || !textColor) {
        if (own) {
          literal()
          continue
        }
        break
      }
      const seen = drawn(what, fillColor, surfaces(m, 'neutral'))
      const hover = valueOf(m, '--color-overlay-hover')
      const on: [string, string][] = [
        ...seen,
        ...(hover && alphaOf(hover) > 0
          ? drawn('a hover', hover, seen).map(([n, c]): [string, string] => [
              n.replace(/^a hover over (.*)$/, '$1 under a hover'),
              c,
            ])
          : []),
      ]
      const keys = Object.keys(g.ramp)
        .map(Number)
        .sort((a, b) => a - b)
      if (
        own
        && parseColor(own)
        && Math.min(...on.map(([, bg]) => contrast(own, bg))) >= TEXT
      ) {
        literal()
        continue
      }
      const ownRgb = own ? parseColor(own) : null
      const from = (ownRgb ? hex(ownRgb) : null) ?? baseLift(m) ?? textColor
      const start = keys.reduce((x, y) =>
        perceptualDelta(g.ramp[y], from) < perceptualDelta(g.ramp[x], from)
          ? y
          : x,
      )
      const scored = keys
        .sort(
          (a, b) =>
            Math.abs(a - start) - Math.abs(b - start)
            || (Math.sign(b - a) === TOWARD_CONTRAST[m] ? 1 : -1),
        )
        .map(stop => ({
          stop,
          r: Math.min(...on.map(([, bg]) => contrast(g.ramp[stop], bg))),
        }))
      const b
        = scored.find(x => x.r >= TEXT)
          ?? scored.reduce((x, y) => (y.r > x.r ? y : x))
      byMode[m] = g.palette
        ? ref('neutral', m, b.stop)
        : { stop: b.stop, color: g.ramp[b.stop], family: 'literal' }
      const moved = hex(parseColor(g.ramp[b.stop]) as ColorTriple) !== from
      if (b.r < TEXT || moved) {
        checks.push({
          token: '--color-text-secondary',
          mode: m,
          stop: b.stop,
          preferred: start,
          against: `${what} over the surfaces`,
          ratio: round(b.r),
          needs: TEXT,
          pass: b.r >= TEXT,
          dials: ['accent', 'neutral'],
          note:
              b.r >= TEXT
                ? `--color-text-secondary on ${parts} uses ${g.ramp[b.stop]} in ${m}, not ${from}, so it stays readable (${round(b.r)}:1) on ${what} and under a hover`
                : `--color-text-secondary on ${parts} reads at only ${round(b.r)}:1 in ${m} on ${what} even at ${g.ramp[b.stop]}, the most contrasting gray (needs ${TEXT}:1): pick another accent or neutral, or set --color-text-secondary on those parts exactly`,
        })
      }
    }
    if (modes.every(m => byMode[m])) {
      found[ground] = byMode
    }
  }
  return Object.keys(found).length ? found : null
}

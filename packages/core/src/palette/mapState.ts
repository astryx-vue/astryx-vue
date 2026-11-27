import type { ContrastCheck, PaletteDial, PaletteFill, PaletteMapping, PaletteMappingContext, PaletteMode, StopRef } from './mappingTables'
import type { TonalPaletteCandidate } from './types'
import { TOWARD_CONTRAST } from './mappingTables'
import { paletteTools, round } from './mappingTools'

/**
 * The tools and result tables one palette mapping shares across its phases
 * (neutral, each color family, the lifted secondary text).
 */
export function createMapState(
  candidate: TonalPaletteCandidate,
  dials: ReadonlyArray<PaletteDial>,
  fills: Record<string, PaletteFill>,
  context: PaletteMappingContext,
) {
  const t = paletteTools(candidate, context)
  const {
    stops,
    at,
    atInside,
    ref,
    exactOf,
    rawOf,
    settingOf,
    side,
    solid,
    surfaces,
    contrast,
    over,
    parseColor,
    alphaOf,
  } = t
  const { base, has } = context
  // Both halves, for a one-mode theme too.
  const modes: PaletteMode[] = ['light', 'dark']
  const tokens: PaletteMapping['tokens'] = {}
  const checks: ContrastCheck[] = []
  const exact: PaletteMapping['exact'] = {}
  const unread: Record<string, string> = {}
  const setExactly = (k: string): boolean => context.setExactly?.(k) ?? false
  const reports = (k: string): boolean => has(k) && !setExactly(k)
  /** Point a token at its stops. One mode's stop stands for both when only one is given. */
  const put = (
    token: string,
    id: string,
    refs: Partial<Record<PaletteMode, StopRef>>,
  ): void => {
    if (!has(token)) {
      return
    }
    const one = refs[modes[0]] as StopRef
    tokens[token] = {
      family: id,
      light: refs.light ?? one,
      dark: refs.dark ?? one,
    }
  }
  const each = <T>(
    fn: (m: PaletteMode) => T,
  ): Partial<Record<PaletteMode, T>> =>
    Object.fromEntries(modes.map(m => [m, fn(m)]))
  /**
   * The stop nearest `start` that reads at `needs` on every color in `on`,
   * searched both ways (the usual way first on a tie: darker in light,
   * lighter in dark); the most contrasting stop of all when none does.
   */
  const pick = (
    token: string,
    id: string,
    m: PaletteMode,
    start: number,
    on: [string, string][],
    needs: number,
  ): StopRef => {
    const usual = TOWARD_CONTRAST[m]
    const order = [...stops].sort(
      (a, b) =>
        Math.abs(a - start) - Math.abs(b - start)
        || (Math.sign(b - a) === usual ? 1 : -1),
    )
    const score = (stop: number): number => {
      const c = ref(id, m, stop).color
      return Math.min(...on.map(([, bg]) => contrast(c, bg)))
    }
    const scored = order.map(stop => ({ stop, r: score(stop) }))
    const b
      = scored.find(x => x.r >= needs)
        ?? scored.reduce((x, y) => (y.r > x.r ? y : x))
    if (reports(token)) {
      checks.push({
        token,
        mode: m,
        stop: b.stop,
        preferred: start,
        against: on.map(([n]) => n).join(', '),
        ratio: round(b.r),
        needs,
        pass: b.r >= needs,
      })
    }
    return ref(id, m, b.stop)
  }

  const neutral = dials.find(f => f.id === 'neutral')
  return {
    candidate,
    dials,
    fills,
    context,
    t,
    stops,
    at,
    atInside,
    ref,
    exactOf,
    rawOf,
    settingOf,
    side,
    solid,
    surfaces,
    contrast,
    over,
    parseColor,
    alphaOf,
    base,
    has,
    modes,
    tokens,
    checks,
    exact,
    unread,
    setExactly,
    reports,
    put,
    each,
    pick,
    neutral,
  }
}
export type MapState = ReturnType<typeof createMapState>

import type { MapState } from './mapState'
import { NEUTRAL_INSIDE, NEUTRAL_STOPS, NEUTRAL_TINTS, NON_TEXT, paletteToken, TEXT } from './mappingTables'

export function mapNeutral(s: MapState) {
  const { at, atInside, ref, exactOf, side, surfaces, exact, put, each, pick, neutral } = s
  if (neutral) {
    for (const [token, pair] of Object.entries(NEUTRAL_STOPS)) {
      if (
        token === '--color-text-secondary'
        || token === '--color-icon-secondary'
      ) {
        continue
      }
      const shadeAt = NEUTRAL_INSIDE.includes(token) ? atInside : at
      put(
        token,
        'neutral',
        each(m => ref('neutral', m, shadeAt(pair[side(m)]))),
      )
    }
    for (const [token, pair] of Object.entries(NEUTRAL_TINTS)) {
      put(
        token,
        'neutral',
        each((m) => {
          const [s, a] = pair[side(m)]
          return ref('neutral', m, at(s), a)
        }),
      )
    }
    for (const [token, needs] of [
      ['--color-text-secondary', TEXT],
      ['--color-icon-secondary', NON_TEXT],
    ] as const) {
      put(
        token,
        'neutral',
        each(m =>
          pick(
            token,
            'neutral',
            m,
            at(NEUTRAL_STOPS[token][side(m)]),
            surfaces(m, 'neutral'),
            needs,
          ),
        ),
      )
    }
    const surface = paletteToken('neutral')
    const set = each(m => exactOf(surface, m))
    if (Object.values(set).some(Boolean)) {
      exact[surface] = Object.fromEntries(
        Object.entries(set).filter(([, v]) => v),
      )
    }
  }
}

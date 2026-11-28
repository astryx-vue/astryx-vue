import type { PaletteBase, PaletteColorReader, PaletteDial, PaletteFill, PaletteMapping, PaletteMappingContext } from './mappingTables'
import type { TonalPaletteCandidate } from './types'
import { mapFamily } from './mapFamily'
import { mapLift } from './mapLift'
import { mapNeutral } from './mapNeutral'
import { createMapState } from './mapState'

export * from './mappingPlan'
export * from './mappingTables'
export * from './mappingTools'
export type { PaletteBase, PaletteColorReader, PaletteMappingContext }

/**
 * 把生成好的候选调色板映射到颜色令牌：每个令牌取哪一阶（亮、暗各一个），
 * 以及每次选择背后的对比度检查。分阶段做：中性色、各个颜色族、次要文字的提亮。
 */
export function mapPalette(
  candidate: TonalPaletteCandidate,
  dials: ReadonlyArray<PaletteDial>,
  fills: Record<string, PaletteFill>,
  context: PaletteMappingContext,
): PaletteMapping {
  const state = createMapState(candidate, dials, fills, context)
  mapNeutral(state)
  for (const dial of dials) {
    if (dial.id !== 'neutral')
      mapFamily(state, dial)
  }
  const lift = mapLift(state)
  return {
    tokens: state.tokens,
    contrast: state.checks.filter(c => c.note !== ''),
    exact: state.exact,
    unread: state.unread,
    lift,
  }
}

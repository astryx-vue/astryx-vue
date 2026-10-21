import type { SegmentedControlContextValue } from './types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export const segmentedControlContextKey = defineLayerScopedKey<SegmentedControlContextValue | null>(
  'astryx-segmented-control',
  null,
)

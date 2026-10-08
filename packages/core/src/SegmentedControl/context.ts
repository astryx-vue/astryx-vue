import type { InjectionKey } from 'vue'
import type { SegmentedControlContextValue } from './types.js'

export const segmentedControlContextKey: InjectionKey<SegmentedControlContextValue>
  = Symbol('astryx-segmented-control')

import type { InjectionKey } from 'vue'
import type { SankeyContext } from './types.js'
import { inject } from 'vue'

export const sankeyContextKey: InjectionKey<SankeyContext> = Symbol('astryx-sankey-chart')

export function useSankey(): SankeyContext {
  const context = inject(sankeyContextKey, null)
  if (!context)
    throw new Error('Sankey components must be used inside <SankeyChart>')
  return context
}

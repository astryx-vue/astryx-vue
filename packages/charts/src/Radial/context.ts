import type { InjectionKey } from 'vue'
import type { RadialContext } from './types.js'
import { inject } from 'vue'

export const radialContextKey: InjectionKey<RadialContext> = Symbol('astryx-radial-chart')

export function useRadial(): RadialContext {
  const context = inject(radialContextKey, null)
  if (!context)
    throw new Error('Radial components must be used inside <RadialChart>')
  return context
}

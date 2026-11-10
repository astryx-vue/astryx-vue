import type { InjectionKey } from 'vue'
import type { ThreeDContext } from './types.js'
import { inject } from 'vue'

export const threeDContextKey: InjectionKey<ThreeDContext> = Symbol('astryx-three-d-chart')

export function use3D(): ThreeDContext {
  const context = inject(threeDContextKey, null)
  if (!context)
    throw new Error('3D components must be used inside <ThreeDChart>')
  return context
}

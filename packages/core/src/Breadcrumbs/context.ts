import type { BreadcrumbContextValue } from './types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export const breadcrumbContextKey = defineLayerScopedKey<Readonly<BreadcrumbContextValue> | undefined>(
  'breadcrumbContext',
  undefined,
)

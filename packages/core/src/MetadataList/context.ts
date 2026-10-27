import type { MetadataListContextValue } from './types.js'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export const metadataListKey = defineLayerScopedKey<MetadataListContextValue | null>('astryx-metadata-list', null)

export function useMetadataListContext(): MetadataListContextValue | null {
  return readLayerScoped(metadataListKey)
}

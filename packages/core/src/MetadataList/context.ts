import type { InjectionKey } from 'vue'
import type { MetadataListContextValue } from './types.js'
import { inject } from 'vue'

export const metadataListKey: InjectionKey<MetadataListContextValue> = Symbol('astryx-metadata-list')

export function useMetadataListContext(): MetadataListContextValue | null {
  return inject(metadataListKey, null)
}

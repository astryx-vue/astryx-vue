import type { InjectionKey } from 'vue'
import type { TabListContextValue } from './types.js'

export const tabListContextKey: InjectionKey<TabListContextValue> = Symbol('tabListContext')

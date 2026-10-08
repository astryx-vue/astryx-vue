import type { InjectionKey } from 'vue'
import type { BreadcrumbContextValue } from './types.js'

export const breadcrumbContextKey: InjectionKey<Readonly<BreadcrumbContextValue>> = Symbol('breadcrumbContext')

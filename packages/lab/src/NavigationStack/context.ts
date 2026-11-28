import type { InjectionKey } from 'vue'
import type { NavigationStackApi } from './types'
import { inject } from 'vue'

export const navigationStackKey: InjectionKey<NavigationStackApi> = Symbol('AstryxNavigationStack')

/** 外层 NavigationStack 的 push / pop / popToRoot。 */
export function useNavigationStack<T = unknown>(): NavigationStackApi<T> {
  const api = inject(navigationStackKey, null)
  if (api == null)
    throw new Error('useNavigationStack must be used inside a NavigationStack')
  return api as NavigationStackApi<T>
}

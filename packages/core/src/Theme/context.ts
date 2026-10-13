import type { ComputedRef, InjectionKey } from 'vue'
import type { ThemeDefinition, ThemeMode } from './types.js'

export interface ThemeContextValue {
  theme: ThemeDefinition
  mode: ThemeMode
}

export const themeContextKey: InjectionKey<ComputedRef<ThemeContextValue>> = Symbol('astryx-theme')

/** Present when this component is already inside a Theme. */
export const themeNestingKey: InjectionKey<true> = Symbol('astryx-theme-nesting')

export const mediaThemeKey: InjectionKey<ComputedRef<'dark' | 'light' | 'off'>> = Symbol('astryx-media-theme')

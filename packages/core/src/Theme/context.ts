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

/**
 * `system` 模式跟谁：页面根的配色（`root`），还是在强制了浅色或深色的 Theme
 * 里面跟读者的偏好（`preference`）。由 Theme 提供，没有 Theme 时按 `root`。
 */
export const systemSchemeKey: InjectionKey<ComputedRef<'preference' | 'root'>> = Symbol('astryx-system-scheme')

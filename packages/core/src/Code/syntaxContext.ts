import type { ComputedRef, InjectionKey } from 'vue'
import type { SyntaxThemeDefinition } from './syntaxTheme.js'

export const syntaxThemeKey: InjectionKey<ComputedRef<SyntaxThemeDefinition | null>> = Symbol('astryx-syntax-theme')

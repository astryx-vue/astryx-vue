import { defineDemo } from '../../demo-infra/defineDemo'
import activeNameDemo from './active-name.vue'
import activeNameSource from './active-name.vue?raw&highlighted'
import tokenValuesDemo from './token-values.vue'
import tokenValuesSource from './token-values.vue?raw&highlighted'

export const useThemeTokenValues = defineDemo(tokenValuesDemo, tokenValuesSource, { className: 'theme-preview' })
export const useThemeActiveName = defineDemo(activeNameDemo, activeNameSource)

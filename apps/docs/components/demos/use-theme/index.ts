import { defineDemo } from '../../demo-infra/defineDemo'
import tokenValuesDemo from './token-values.vue'
import tokenValuesSource from './token-values.vue?raw&highlighted'

export const useThemeTokenValues = defineDemo(tokenValuesDemo, tokenValuesSource, { className: 'theme-preview' })

import { defineDemo } from '../../demo-infra/defineDemo'
import darkDemo from './dark.vue'
import darkSource from './dark.vue?raw&highlighted'
import lightDemo from './light.vue'
import lightSource from './light.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'syntax-theme-preview' }

export const syntaxThemeOverview = defineDemo(overviewDemo, overviewSource, options)
export const syntaxThemeDark = defineDemo(darkDemo, darkSource, options)
export const syntaxThemeLight = defineDemo(lightDemo, lightSource, options)

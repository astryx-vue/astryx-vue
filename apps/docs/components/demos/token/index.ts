import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import { tokenMeta } from './meta'

export { tokenMeta }
export const tokenBasic = defineDemo(basicDemo, basicSource)
export const tokenColors = defineDemo(colorsDemo, colorsSource)

import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const column = { className: 'chat-preview' }

export const chatTokenizedTextOverview = defineDemo(overviewDemo, overviewSource, column)
export const chatTokenizedTextBasic = defineDemo(basicDemo, basicSource, column)
export const chatTokenizedTextColors = defineDemo(colorsDemo, colorsSource, column)

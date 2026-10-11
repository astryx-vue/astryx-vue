import { defineDemo } from '../../demo-infra/defineDemo'
import axesDemo from './axes.vue'
import axesSource from './axes.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import paddingDemo from './padding.vue'
import paddingSource from './padding.vue?raw&highlighted'

const options = { className: 'center-preview' }

export const centerBasic = defineDemo(basicDemo, basicSource, options)
export const centerAxes = defineDemo(axesDemo, axesSource, options)
export const centerPadding = defineDemo(paddingDemo, paddingSource, options)
export const centerInline = defineDemo(inlineDemo, inlineSource, options)

export const centerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

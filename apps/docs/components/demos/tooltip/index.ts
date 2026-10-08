import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import placementsDemo from './placements.vue'
import placementsSource from './placements.vue?raw&highlighted'
import textDemo from './text.vue'
import textSource from './text.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const tooltipBasic = defineDemo(basicDemo, basicSource, options)
export const tooltipPlacements = defineDemo(placementsDemo, placementsSource, options)
export const tooltipText = defineDemo(textDemo, textSource, options)
export const tooltipControlled = defineDemo(controlledDemo, controlledSource, options)
export const tooltipOverview = defineDemo(overviewDemo, overviewSource, options)

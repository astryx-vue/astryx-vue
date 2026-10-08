import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import controlledDemo from './controlled.vue'
import controlledSource from './controlled.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import placementsDemo from './placements.vue'
import placementsSource from './placements.vue?raw&highlighted'

const options = { className: 'hover-card-preview' }

export const hoverCardOverview = defineDemo(overviewDemo, overviewSource, options)
export const hoverCardBasic = defineDemo(basicDemo, basicSource, options)
export const hoverCardPlacements = defineDemo(placementsDemo, placementsSource, options)
export const hoverCardControlled = defineDemo(controlledDemo, controlledSource, options)

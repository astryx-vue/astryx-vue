import { defineDemo } from '../../demo-infra/defineDemo'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import elevatedDemo from './elevated.vue'
import elevatedSource from './elevated.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import plansDemo from './plans.vue'
import plansSource from './plans.vue?raw&highlighted'

const options = { className: 'selectable-card-preview' }

export const selectableCardPlans = defineDemo(plansDemo, plansSource, options)
export const selectableCardColors = defineDemo(colorsDemo, colorsSource, options)
export const selectableCardElevated = defineDemo(elevatedDemo, elevatedSource, options)
export const selectableCardOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })

import { defineDemo } from '../../demo-infra/defineDemo'
import calloutDemo from './callout.vue'
import calloutSource from './callout.vue?raw&highlighted'
import elevationDemo from './elevation.vue'
import elevationSource from './elevation.vue?raw&highlighted'
import layoutDemo from './layout.vue'
import layoutSource from './layout.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import simpleDemo from './simple.vue'
import simpleSource from './simple.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'card-preview' }

export const cardCallout = defineDemo(calloutDemo, calloutSource, options)
export const cardElevation = defineDemo(elevationDemo, elevationSource, options)
export const cardLayout = defineDemo(layoutDemo, layoutSource, options)
export const cardSimple = defineDemo(simpleDemo, simpleSource, options)
export const cardVariants = defineDemo(variantsDemo, variantsSource, options)
export const cardOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

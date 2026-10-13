import { defineDemo } from '../../demo-infra/defineDemo'
import indicatorsDemo from './indicators.vue'
import indicatorsSource from './indicators.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import pulsingDemo from './pulsing.vue'
import pulsingSource from './pulsing.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

export const statusDotIndicators = defineDemo(indicatorsDemo, indicatorsSource, {
  className: 'status-dot-preview',
})

export const statusDotVariants = defineDemo(variantsDemo, variantsSource, {
  className: 'status-dot-preview',
})

export const statusDotPulsing = defineDemo(pulsingDemo, pulsingSource, {
  className: 'status-dot-preview',
})

export const statusDotOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })

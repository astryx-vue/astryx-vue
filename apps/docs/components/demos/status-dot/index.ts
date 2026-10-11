import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import pulsingDemo from './pulsing.vue'
import pulsingSource from './pulsing.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

export const statusDotVariants = defineDemo(variantsDemo, variantsSource, {
  className: 'status-dot-preview',
})

export const statusDotPulsing = defineDemo(pulsingDemo, pulsingSource, {
  className: 'status-dot-preview',
})

export const statusDotOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })

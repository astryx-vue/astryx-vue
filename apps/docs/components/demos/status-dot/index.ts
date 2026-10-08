import { defineDemo } from '../../demo-infra/defineDemo'
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

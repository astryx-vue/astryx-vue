import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import elevationDemo from './elevation.vue'
import elevationSource from './elevation.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import paddingDemo from './padding.vue'
import paddingSource from './padding.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'card-preview' }

export const cardBasic = defineDemo(basicDemo, basicSource, options)
export const cardVariants = defineDemo(variantsDemo, variantsSource, options)
export const cardElevation = defineDemo(elevationDemo, elevationSource, options)
export const cardPadding = defineDemo(paddingDemo, paddingSource, options)

export const cardOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

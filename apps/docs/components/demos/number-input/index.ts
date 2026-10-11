import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import precisionDemo from './precision.vue'
import precisionSource from './precision.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

export const numberInputBasic = defineDemo(basicDemo, basicSource)
export const numberInputPrecision = defineDemo(precisionDemo, precisionSource)
export const numberInputSizes = defineDemo(sizesDemo, sizesSource)

export const numberInputOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

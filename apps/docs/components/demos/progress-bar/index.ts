import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import indeterminateDemo from './indeterminate.vue'
import indeterminateSource from './indeterminate.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const progressBarBasic = defineDemo(basicDemo, basicSource, options)
export const progressBarSizes = defineDemo(sizesDemo, sizesSource, options)
export const progressBarVariants = defineDemo(variantsDemo, variantsSource, options)
export const progressBarIndeterminate = defineDemo(indeterminateDemo, indeterminateSource, options)

export const progressBarOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

import { defineDemo } from '../../demo-infra/defineDemo'
import dividersDemo from './dividers.vue'
import dividersSource from './dividers.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'
import washDemo from './wash.vue'
import washSource from './wash.vue?raw&highlighted'

const options = { className: 'section-preview' }

export const sectionWash = defineDemo(washDemo, washSource, options)
export const sectionDividers = defineDemo(dividersDemo, dividersSource, options)
export const sectionVariants = defineDemo(variantsDemo, variantsSource, options)
export const sectionOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })

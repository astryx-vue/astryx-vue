import { defineDemo } from '../../demo-infra/defineDemo'
import fullBleedDemo from './full-bleed.vue'
import fullBleedSource from './full-bleed.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'
import verticalDemo from './vertical.vue'
import verticalSource from './vertical.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const dividerFullBleed = defineDemo(fullBleedDemo, fullBleedSource, options)
export const dividerVariants = defineDemo(variantsDemo, variantsSource, options)
export const dividerVertical = defineDemo(verticalDemo, verticalSource, options)
export const dividerOverview = defineDemo(overviewDemo, overviewSource, options)

import { defineDemo } from '../../demo-infra/defineDemo'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'overview-row' }

export const avatarStatusDotOverview = defineDemo(overviewDemo, overviewSource, options)
export const avatarStatusDotVariants = defineDemo(variantsDemo, variantsSource, options)
